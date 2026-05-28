# AGENTS.md

## 目标
本仓库是一个已上线的世界杯赛程站点。日常维护目标只有一件事：
**每天快速、准确地同步 FIFA 官网的赛果与晋级关系，并推送到远程触发帽子云自动部署。**

---

## 维护模式（两种）

### 模式 A（推荐）：定时自动执行 + 推送日报
适合你不一定每天开电脑的情况。建议通过云端 Codex / CI 定时任务在 **每天 08:00（Asia/Shanghai）** 触发。

> 自动化窗口：仅在 **2026-06-08 ~ 2026-07-22（Asia/Shanghai）** 执行真实同步；窗口外仅检查日期后跳过。

执行内容：
1. 先做日期 gate（不在窗口内则直接跳过）。
2. 拉取代码并同步分支。
3. 按本文件规则更新 `src/data/matches.ts` / `src/data/bracket.ts`。
4. 运行 `npm run build` 校验。
5. 自动提交与推送（当前已开启：仅当 `src/data/matches.ts` 或 `src/data/bracket.ts` 发生变化时执行）。
6. 生成“今日更新说明”并发送给你（消息/邮件/机器人回执）。

> 注意：定时任务平台负责“定时触发”；本文件负责“触发后做什么”。

### 模式 B：你每天手动发 prompt 执行
你在手机端发一句固定 prompt 即可，例如：

```text
按 AGENTS.md 执行今日 FIFA 赛果同步：核对官网、更新 matches/bracket、build、commit、push，并给我更新摘要。
```

---

## 每日固定流程（必须按顺序执行）

1. **拉取最新代码**
   - `git pull --rebase`

2. **核对官方来源（只看官方）**
   - 以 `src/data/sources.ts` 中的 FIFA 官方链接为准。
   - 优先核对：
     - 比赛是否结束
     - 比分
     - 淘汰赛胜者是谁
     - 胜者进入了哪一场

3. **更新比赛数据 `src/data/matches.ts`**
   - 已结束比赛：
     - 更新 `homeScore`、`awayScore`
     - 更新 `matchStatus: 'finished'`
     - 更新 `resultStatus: 'official'`
     - `lastUpdated` 改为当天（UTC 日期即可，格式 `YYYY-MM-DD`）
   - 未开赛比赛不要误改比分。

4. **更新晋级树 `src/data/bracket.ts`（如有晋级变化）**
   - 仅在官方确认胜者后，写入对应下一轮槽位。
   - 不提前填写未产生的胜者。
   - 不提前填写冠军。

5. **必要时更新球队占位/引用关系**
   - 若某场从 `slot-*` 变为真实球队，确保引用一致。
   - 一般只改必要字段，避免无关重排。

6. **本地校验（必须）**
   - 必跑：`npm run build`
   - 如失败，先修复再提交。

7. **提交代码（必须）**
   - `git add -A`
   - `git commit -m "chore(data): sync fifa results YYYY-MM-DD"`

8. **推送远程（必须）**
   - `git push`
   - 推送后帽子云会自动部署。

9. **输出更新摘要（必须）**
   - 列出：
     - 更新了哪些场次（matchNo）
     - 哪些比分被写入
     - 哪些晋级槽位被更新
     - 构建是否通过
     - commit hash

---

## 更新优先级

1. 当日刚结束的比赛（比分与赛果）
2. 涉及淘汰赛晋级链路的比赛
3. 其余信息（如文字备注）

---

## 严格约束

- 只使用官方来源，不使用二手新闻做最终写入。
- 不做功能开发；日更任务只改数据。
- 不改 UI 文案与样式，除非用户明确要求。
- 不新增预测内容。
- 修改保持最小化，避免格式化全文件。

---

## 提交信息规范

- 每日数据同步：
  - `chore(data): sync fifa results YYYY-MM-DD`
- 若仅晋级树：
  - `chore(data): update knockout bracket YYYY-MM-DD`

---

## 快速检查清单（提交前自检）

- [ ] 所有已结束比赛都填了比分
- [ ] 已结束比赛状态为 `finished`
- [ ] `resultStatus` 已设为 `official`
- [ ] 晋级关系与官网一致
- [ ] `npm run build` 通过
- [ ] 已 commit
- [ ] 已 push
- [ ] 已输出更新摘要给你
