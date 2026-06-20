---
description: "按 AGENTS.md 执行今日 FIFA 赛果同步：核对官网、更新 matches/bracket、build、commit、push，并给我更新摘要。"
---

# 每日 FIFA 赛果同步

按 AGENTS.md 执行今日 FIFA 赛果同步流程。

## 执行步骤

1. **拉取最新代码**
   - `git pull --rebase`

2. **核对官方来源**
   - 以 `src/data/sources.ts` 中的 FIFA 官方链接为准
   - 核对：比赛是否结束、比分、淘汰赛胜者、胜者进入哪一场

3. **更新比赛数据 `src/data/matches.ts`**
   - 已结束比赛：更新 `homeScore`、`awayScore`、`matchStatus: 'finished'`、`resultStatus: 'official'`、`lastUpdated`
   - 未开赛比赛不要误改比分

4. **更新晋级树 `src/data/bracket.ts`（如有晋级变化）**
   - 仅在官方确认胜者后，写入对应下一轮槽位
   - 不提前填写未产生的胜者

5. **本地校验**
   - 必跑：`npm run build`
   - 如失败，先修复再提交

6. **提交代码**
   - `git add -A`
   - `git commit -m "chore(data): sync fifa results YYYY-MM-DD"`

7. **推送远程**
   - `git push`

8. **输出更新摘要**
   - 更新了哪些场次（matchNo）
   - 哪些比分被写入
   - 哪些晋级槽位被更新
   - 构建是否通过
   - commit hash

## 约束

- 只使用官方来源，不使用二手新闻做最终写入
- 不做功能开发；日更任务只改数据
- 不改 UI 文案与样式
- 修改保持最小化，避免格式化全文件
