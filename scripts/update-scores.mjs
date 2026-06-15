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
