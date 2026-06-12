/**
 * 每日从 TheSportsDB 免费 API 拉取世界杯比分，
 * 更新 src/data/matchResults.json。
 *
 * 用法: node scripts/update-scores.mjs
 * 在 GitHub Actions 中每天自动运行。
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const RESULTS_PATH = resolve(ROOT, 'src/data/matchResults.json');
const MATCHES_PATH = resolve(ROOT, 'src/data/matches.ts');

const SPORTSDB_API = 'https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4429&s=2026';

// TheSportsDB 队名 → 我们的 team ID（matches.ts 中的格式）
const SPORTSDB_TEAM_MAP = {
  'mexico': 'mexico',
  'south africa': 'south-africa',
  'south korea': 'korea-republic',
  'czech republic': 'czechia',
  'canada': 'canada',
  'bosnia-herzegovina': 'bosnia',
  'bosnia and herzegovina': 'bosnia',
  'bosnia & herzegovina': 'bosnia',
  'qatar': 'qatar',
  'switzerland': 'switzerland',
  'brazil': 'brazil',
  'morocco': 'morocco',
  'haiti': 'haiti',
  'scotland': 'scotland',
  'usa': 'usa',
  'united states': 'usa',
  'paraguay': 'paraguay',
  'australia': 'australia',
  'turkey': 'turkey',
  'türkiye': 'turkey',
  'germany': 'germany',
  'curaçao': 'curacao',
  'ivory coast': 'ivory-coast',
  'côte d\'ivoire': 'ivory-coast',
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

function toTeamId(name) {
  const lower = name.toLowerCase();
  return SPORTSDB_TEAM_MAP[lower] ?? lower.replace(/\s+/g, '-');
}

async function main() {
  console.log('=== 2026 World Cup Score Update ===');
  console.log(`Fetching: ${SPORTSDB_API}`);

  const res = await fetch(SPORTSDB_API);
  const data = await res.json();

  if (!data.events) {
    console.error('❌ No events in response:', JSON.stringify(data).slice(0, 200));
    process.exit(1);
  }

  console.log(`📡 Got ${data.events.length} events from TheSportsDB\n`);

  // 读取现有结果
  const existing = JSON.parse(readFileSync(RESULTS_PATH, 'utf-8'));
  let updated = 0;

  for (const event of data.events) {
    const { strHomeTeam, strAwayTeam, intHomeScore, intAwayScore, strStatus, dateEvent } = event;

    const homeId = toTeamId(strHomeTeam);
    const awayId = toTeamId(strAwayTeam);

    // 找 matchNo：读取 matches.ts 中的 groupStageRows
    const matchNo = findMatchNo(dateEvent, homeId, awayId);
    if (!matchNo) {
      console.log(`⏭️  Skip: ${strHomeTeam} vs ${strAwayTeam} (no match found, date=${dateEvent})`);
      continue;
    }

    // 跳过未开赛的（NS = Not Started, TBD = To Be Determined）
    if (strStatus === 'NS' || strStatus === 'TBD' || strStatus === '') {
      continue;
    }

    const key = String(matchNo);
    const oldEntry = existing[key];

    // 解析比分
    const homeScore = intHomeScore != null ? Number(intHomeScore) : null;
    const awayScore = intAwayScore != null ? Number(intAwayScore) : null;

    // 状态映射
    let matchStatus = 'scheduled';
    if (strStatus === 'FT' || strStatus === 'AET' || strStatus === 'PEN') {
      matchStatus = 'finished';
    } else if (strStatus === '1H' || strStatus === '2H' || strStatus === 'HT' || strStatus === 'LIVE') {
      matchStatus = 'live';
    }

    // 判断 resultStatus
    const hasScore = homeScore != null && awayScore != null;
    const resultStatus = matchStatus === 'finished' && hasScore ? 'official' : 'pending';
    const effectiveStatus = matchStatus === 'finished' && hasScore ? 'finished' : matchStatus;

    const newEntry = {
      homeScore,
      awayScore,
      matchStatus: effectiveStatus,
      resultStatus,
    };

    // 检查是否有变化
    const oldStr = JSON.stringify(oldEntry);
    const newStr = JSON.stringify(newEntry);
    if (oldStr === newStr) {
      console.log(`   ${strHomeTeam} ${homeScore}-${awayScore} ${strAwayTeam} [${strStatus}] → match#${matchNo} (no change)`);
      continue;
    }

    existing[key] = newEntry;
    updated++;
    console.log(`✅ ${strHomeTeam} ${homeScore}-${awayScore} ${strAwayTeam} [${strStatus}] → match#${matchNo} UPDATED`);
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
 * 解析格式: [matchNo, 'group', 'home', 'away', 'kickoffUtc', 'venue'],
 */
function findMatchNo(dateEvent, homeId, awayId) {
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

    // 解析 groupStageRows 数组中的行
    // venue 字段可能用双引号（含撇号如 Levi's）或单引号
    // 格式: [matchNo, 'group', 'home', 'away', 'kickoffUtc', venue],
    const rowRegex = /\[(\d+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*(?:'([^']+)'|"([^"]+)")\]/g;
    let match;
    while ((match = rowRegex.exec(text)) !== null) {
      const [, matchNo, group, home, away, kickoffUtc] = match;

      // 用与 matches.ts 相同的逻辑转换 team ID
      const resolvedHome = teamMap[home] ?? home.replace(/\s+/g, '-');
      const resolvedAway = teamMap[away] ?? away.replace(/\s+/g, '-');

      // 提取日期 (YYYY-MM-DD)
      const matchDate = kickoffUtc.slice(0, 10);

      if (matchDate === dateEvent && resolvedHome === homeId && resolvedAway === awayId) {
        return Number(matchNo);
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
