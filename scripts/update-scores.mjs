/**
 * 从 ESPN 公开 API 拉取 2026 世界杯比分，更新 src/data/matchResults.json。
 * 零 API Key，零付费。
 *
 * 用法: node scripts/update-scores.mjs
 * GitHub Actions 中每 6 小时自动运行。
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const RESULTS_PATH = resolve(ROOT, 'src/data/matchResults.json');
const MATCHES_PATH = resolve(ROOT, 'src/data/matches.ts');

// ESPN 2026 World Cup API (公开，无需认证)
const ESPN_API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260720';

const STATUS_MAP = {
  STATUS_FULL_TIME: 'finished',
  STATUS_FINAL: 'finished',
  STATUS_FINAL_PEN: 'finished',
  STATUS_IN_PROGRESS: 'live',
  STATUS_HALF_TIME: 'live',
  STATUS_FIRST_HALF: 'live',
  STATUS_SECOND_HALF: 'live',
  STATUS_END_OF_REGULATION: 'live',
  STATUS_EXTRA_TIME: 'live',
  STATUS_PENALTY_SHOOTOUT: 'live',
  STATUS_SCHEDULED: 'scheduled',
  STATUS_POSTPONED: 'scheduled',
  STATUS_CANCELED: 'scheduled',
};

// ESPN 队名 → 我们的 team ID
const ESPN_TEAM_MAP = {
  'mexico': 'mexico',
  'south africa': 'south-africa',
  'south korea': 'korea-republic',
  'czechia': 'czechia',
  'canada': 'canada',
  'bosnia-herzegovina': 'bosnia',
  'qatar': 'qatar',
  'switzerland': 'switzerland',
  'brazil': 'brazil',
  'morocco': 'morocco',
  'haiti': 'haiti',
  'scotland': 'scotland',
  'united states': 'usa',
  'paraguay': 'paraguay',
  'australia': 'australia',
  'türkiye': 'turkey',
  'turkey': 'turkey',
  'germany': 'germany',
  'curaçao': 'curacao',
  'ivory coast': 'ivory-coast',
  'ecuador': 'ecuador',
  'netherlands': 'netherlands',
  'japan': 'japan',
  'sweden': 'sweden',
  'tunisia': 'tunisia',
  'belgium': 'belgium',
  'egypt': 'egypt',
  'iran': 'iran',
  'new zealand': 'new-zealand',
  'spain': 'spain',
  'cape verde': 'cape-verde',
  'saudi arabia': 'saudi-arabia',
  'uruguay': 'uruguay',
  'france': 'france',
  'senegal': 'senegal',
  'iraq': 'iraq',
  'norway': 'norway',
  'argentina': 'argentina',
  'algeria': 'algeria',
  'austria': 'austria',
  'jordan': 'jordan',
  'portugal': 'portugal',
  'dr congo': 'dr-congo',
  'congo dr': 'dr-congo',
  'uzbekistan': 'uzbekistan',
  'colombia': 'colombia',
  'england': 'england',
  'croatia': 'croatia',
  'ghana': 'ghana',
  'panama': 'panama',
};

function toTeamId(espnName) {
  const lower = espnName.toLowerCase();
  return ESPN_TEAM_MAP[lower] ?? lower.replace(/\s+/g, '-');
}

async function main() {
  console.log('=== 2026 World Cup Score Update ===');
  console.log(`Fetching: ${ESPN_API}`);

  const res = await fetch(ESPN_API);
  const data = await res.json();
  const events = data.events || [];

  console.log(`📡 Got ${events.length} events from ESPN\n`);

  // 读取现有结果
  const existing = JSON.parse(readFileSync(RESULTS_PATH, 'utf-8'));
  let updated = 0;

  for (const event of events) {
    const comp = event.competitions?.[0];
    if (!comp) continue;

    const competitors = comp.competitors || [];
    if (competitors.length !== 2) continue;

    const homeTeam = competitors.find(c => c.homeAway === 'home');
    const awayTeam = competitors.find(c => c.homeAway === 'away');
    if (!homeTeam || !awayTeam) continue;

    const homeName = homeTeam.team?.displayName || '';
    const awayName = awayTeam.team?.displayName || '';
    const homeId = toTeamId(homeName);
    const awayId = toTeamId(awayName);
    const espnStatus = comp.status?.type?.name || 'STATUS_SCHEDULED';
    const utcDate = event.date?.slice(0, 10) || '';

    // 跳过未开始的比赛（ESPN 也不会有比分）
    if (espnStatus === 'STATUS_SCHEDULED') continue;

    // 按日期 + 主队 + 客队匹配我们的 matchNo
    const matchNo = findMatchNo(utcDate, homeId, awayId);
    if (!matchNo) {
      // 只对非 scheduled 的比赛报告 skip
      if (espnStatus !== 'STATUS_SCHEDULED') {
        console.log(`⏭️  Skip: ${homeName} vs ${awayName} (date=${utcDate}, no matchNo found)`);
      }
      continue;
    }

    const key = String(matchNo);
    const oldEntry = existing[key];

    const homeScore = homeTeam.score != null ? Number(homeTeam.score) : null;
    const awayScore = awayTeam.score != null ? Number(awayTeam.score) : null;
    const matchStatus = STATUS_MAP[espnStatus] || 'scheduled';
    const hasScore = homeScore != null && awayScore != null;
    const resultStatus = matchStatus === 'finished' && hasScore ? 'official' : 'pending';

    const newEntry = {
      homeScore,
      awayScore,
      matchStatus,
      resultStatus,
    };

    const oldStr = JSON.stringify(oldEntry);
    const newStr = JSON.stringify(newEntry);
    if (oldStr === newStr) {
      console.log(`   ${homeName} ${homeScore}-${awayScore} ${awayName} [${espnStatus}] → match#${matchNo} (no change)`);
      continue;
    }

    existing[key] = newEntry;
    updated++;
    console.log(`✅ ${homeName} ${homeScore}-${awayScore} ${awayName} [${espnStatus}] → match#${matchNo} UPDATED`);
  }

  if (updated > 0) {
    writeFileSync(RESULTS_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
    console.log(`\n💾 Wrote ${updated} updates to matchResults.json`);
  } else {
    console.log('\n✅ No changes needed');
  }

  // 尝试拉取淘汰赛对阵数据（ESPN API，和比分用同一个源）
  await updateBracketFixture();
}

/**
 * 从 ESPN API 拉取淘汰赛对阵，更新 bracketFixture.json
 * ESPN 返回的队名如 "Group C Winner"、"Third Place Group A/B/C/D/F"
 * 我们把这些映射成 slot ID
 */
async function updateBracketFixture() {
  const FIXTURE_PATH = resolve(ROOT, 'src/data/bracketFixture.json');

  try {
    // 拉取淘汰赛阶段的赛事（6月29日开始）
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260629-20260720', {
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.log('\n⏭️  ESPN bracket fixture: HTTP ' + res.status + ' — 跳过');
      return;
    }

    const data = await res.json();
    const events = data.events || [];

    if (events.length === 0) {
      console.log('\n⏭️  ESPN bracket fixture: 无淘汰赛数据 — 跳过');
      return;
    }

    // 解析 ESPN 的占位队名 → 我们的 slot ID
    const r32 = {};
    let updated = 0;

    for (const event of events) {
      const comp = event.competitions?.[0];
      if (!comp) continue;

      const competitors = comp.competitors || [];
      if (competitors.length !== 2) continue;

      const homeTeam = competitors.find(c => c.homeAway === 'home');
      const awayTeam = competitors.find(c => c.homeAway === 'away');
      if (!homeTeam || !awayTeam) continue;

      const homeName = homeTeam.team?.displayName || '';
      const awayName = awayTeam.team?.displayName || '';
      const matchNo = findKnockoutMatchNo(event.date);

      if (!matchNo || matchNo < 73 || matchNo > 88) continue;

      const homeSlotId = parseEspnSlotName(homeName);
      const awaySlotId = parseEspnSlotName(awayName);

      if (homeSlotId && awaySlotId) {
        r32[String(matchNo)] = { homeTeamId: homeSlotId, awayTeamId: awaySlotId };
        updated++;
      }
    }

    if (updated === 0) {
      console.log('\n⏭️  ESPN bracket fixture: 无新对阵数据 — 跳过');
      return;
    }

    // 读取现有 fixture，合并更新
    let existing = { r32: {}, knockoutWinners: {} };
    try {
      existing = JSON.parse(readFileSync(FIXTURE_PATH, 'utf-8'));
    } catch { /* 文件不存在或为空 */ }

    const oldStr = JSON.stringify(existing.r32);
    existing.r32 = { ...existing.r32, ...r32 };
    const newStr = JSON.stringify(existing.r32);

    if (oldStr === newStr) {
      console.log('\n✅ ESPN bracket fixture: 无变化');
      return;
    }

    writeFileSync(FIXTURE_PATH, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
    console.log(`\n💾 ESPN bracket fixture: 更新了 ${updated} 场 R32 对阵`);
  } catch (err) {
    console.log('\n⏭️  ESPN bracket fixture: ' + err.message + ' — 跳过');
  }
}

/**
 * 把 ESPN 的占位队名解析成我们的 slot ID
 * "Group C Winner" → "slot-c1"
 * "Group F 2nd Place" → "slot-f2"
 * 真实队名（如 "Germany"）→ null（脚本无法确定 slot，由前端从排名计算）
 */
function parseEspnSlotName(name) {
  const lower = name.toLowerCase();

  // "group X winner" → X组第一
  const winnerMatch = lower.match(/group ([a-l]) winner/);
  if (winnerMatch) return `slot-${winnerMatch[1]}1`;

  // "group X 2nd place" → X组第二
  const secondMatch = lower.match(/group ([a-l]) 2nd place/);
  if (secondMatch) return `slot-${secondMatch[1]}2`;

  // 其他（真实队名、Third Place）→ 返回 null，由前端处理
  return null;
}

/**
 * 从 ESPN 淘汰赛事件中找到对应的 matchNo
 * 按日期匹配，同一天有多场时按顺序分配
 */
const knockoutMatchCounter = new Map(); // date → next matchNo index
let knockoutRowsCache = null;

function getKnockoutRows() {
  if (knockoutRowsCache) return knockoutRowsCache;
  try {
    const text = readFileSync(MATCHES_PATH, 'utf-8');
    const rowRegex = /\[(\d+),\s*'([^']+)',\s*'([^']+)'\]/g;
    const rows = [];
    let match;
    while ((match = rowRegex.exec(text)) !== null) {
      const [, matchNo, stage, date] = match;
      if (stage !== '小组赛' && stage !== '冠军') {
        rows.push({ matchNo: Number(matchNo), date: date.slice(0, 10) });
      }
    }
    knockoutRowsCache = rows;
    return rows;
  } catch {
    return [];
  }
}

function findKnockoutMatchNo(utcDate) {
  const eventDate = utcDate?.slice(0, 10);
  if (!eventDate) return null;

  const rows = getKnockoutRows();
  const dayMatches = rows
    .filter(r => {
      const d1 = new Date(r.date);
      const d2 = new Date(eventDate);
      const diff = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
      return diff <= 1;
    })
    .map(r => r.matchNo);

  if (dayMatches.length === 0) return null;

  const used = knockoutMatchCounter.get(eventDate) || 0;
  if (used < dayMatches.length) {
    knockoutMatchCounter.set(eventDate, used + 1);
    return dayMatches[used];
  }
  return null;
}

/**
 * 从 matches.ts 中解析 groupStageRows，找到匹配的 matchNo。
 */
function findMatchNo(utcDate, homeId, awayId) {
  try {
    const text = readFileSync(MATCHES_PATH, 'utf-8');

    // 与 matches.ts 中 teamIdByScheduleName 保持同步
    const teamMap = {
      'south korea': 'korea-republic',
      'czech republic': 'czechia',
      'bosnia & herzegovina': 'bosnia',
      'ivory coast': 'ivory-coast',
      'curaçao': 'curacao',
      'cape verde': 'cape-verde',
      'saudi arabia': 'saudi-arabia',
      'new zealand': 'new-zealand',
      'dr congo': 'dr-congo',
      'congo dr': 'dr-congo',
    };

    const rowRegex = /\[(\d+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(?:'[^']+'|"[^"]+")\]/g;
    let match;
    while ((match = rowRegex.exec(text)) !== null) {
      const [, matchNo, group, rowHome, rowAway, kickoffUtc] = match;
      const resolvedHome = teamMap[rowHome] ?? rowHome.replace(/\s+/g, '-');
      const resolvedAway = teamMap[rowAway] ?? rowAway.replace(/\s+/g, '-');
      const matchDate = kickoffUtc.slice(0, 10);

      // 额外处理：ESPN 有时用 UTC 日期和我们用北京时间日期的差异
      // 尝试精确匹配和 ±1 天的容差匹配
      if (resolvedHome === homeId && resolvedAway === awayId) {
        if (matchDate === utcDate) {
          return Number(matchNo);
        }
      }
    }

    // 容差匹配：同一天可能有 UTC/BJT 日期差异
    // 重新扫描，这次放宽日期限制到 ±0 天（用北京时间考虑）
    rowRegex.lastIndex = 0;
    while ((match = rowRegex.exec(text)) !== null) {
      const [, matchNo, group, rowHome, rowAway, kickoffUtc] = match;
      const resolvedHome = teamMap[rowHome] ?? rowHome.replace(/\s+/g, '-');
      const resolvedAway = teamMap[rowAway] ?? rowAway.replace(/\s+/g, '-');
      const matchDate = kickoffUtc.slice(0, 10);

      if (resolvedHome === homeId && resolvedAway === awayId) {
        // 容差：日期差 ≤1 天
        const d1 = new Date(matchDate);
        const d2 = new Date(utcDate);
        const diff = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);
        if (diff <= 1) {
          return Number(matchNo);
        }
      }
    }
  } catch (err) {
    console.error('⚠️  Error parsing matches.ts:', err.message);
  }
  return null;
}

main().catch((err) => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
