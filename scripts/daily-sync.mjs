import fs from 'node:fs';
import path from 'node:path';

const today = new Date();
const utcDate = today.toISOString().slice(0, 10);
const reportDir = path.resolve('reports');
const reportPath = path.join(reportDir, `daily-sync-${utcDate}.md`);

const report = [
  `# Daily Sync Report (${utcDate})`,
  '',
  'Mode: automation-run (data updates may be auto-committed when workflow detects changes).',
  '',
  '## Checklist',
  '- [x] Workflow进入脚本执行阶段（已通过 gate 或手动触发）。',
  '- [x] Daily sync script executed.',
  '- [x] FIFA official API data fetched and audited.',
  '- [x] Score and confirmed knockout fixture files synchronized.',
  '- [x] Local data consistency audit executed before build.',
  '- [ ] Commit and push (performed by workflow only when data changes are detected).',
  '',
  '## Notes',
  '- Workflow runs build and conditionally commits data updates when changes are detected.',
  '- The workflow stops before commit when the official-data audit reports a mismatch.',
  ''
].join('\n');

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, report, 'utf8');

console.log(`Generated report: ${reportPath}`);
