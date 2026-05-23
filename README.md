# World Cup 2026

**当前版本：V1.0.0（稳定收尾版）** · [更新日志](./CHANGELOG.md)

World Cup 2026 是一个面向中文用户的、移动端优先的 2026 世界杯赛程展示网站。它的目标不是做社区、预测平台或复杂体育数据后台，而是让用户比浏览 FIFA 官方网站更轻松、更直观地查看赛程、北京时间、比赛对阵、比赛地点、比赛阶段和晋级路径。

V1 功能范围已冻结，后续以人工维护赛程数据为主；新功能规划见 [TODO.md](./TODO.md)。

## 项目定位

这是一个公开展示型网站：

- 为中文用户整理世界杯赛程。
- 快速展示下一场重点比赛。
- 快速确认比赛的北京时间。
- 清楚展示谁打谁、在哪打、属于哪个阶段。
- 提供重点比赛入口和淘汰赛路径。
- 提供 FIFA 官方数据入口，方便核对原始信息。
- 保持轻量、清爽、可信、适合手机访问。

V1 仍然是纯前端静态版本，不接后端、不接实时 API、不自动抓取数据。

## 技术栈

- Vite
- React
- TypeScript
- TailwindCSS
- lucide-react
- 本地 TypeScript 数据文件

## V1 功能

- Home 首页概览
- 下一场重点比赛卡片
- 今日 / 最近比赛提醒
- 快速入口：全部赛程、晋级树、官方来源
- Schedule 赛程页
- 日期 / 阶段 / 小组筛选
- 球队名 / 占位名称搜索
- 移动端底部筛选抽屉
- 比赛详情弹窗
- Bracket 晋级路径页
- 当前为空树 / 占位树，不提前填写胜者或冠军
- Sources 数据来源页
- 官方 FIFA 页面入口
- 数据反馈 / 纠错反馈邮箱入口
- 数据状态标记：`matchInfoStatus` / `resultStatus` / `advancementStatus`（及 bracket 的 `dataStatus`）
- PWA 支持，可添加到手机主屏幕

## 当前不做

- 不做预测
- 不做排行榜
- 不做用户系统
- 不做登录注册
- 不做评论区
- 不做社区
- 不做后端
- 不做数据库
- 不做自动化抓取
- 不接实时 API
- 不做任何真实金钱相关功能

## 安装依赖

```bash
npm install
```

## 本地运行

```bash
npm run dev
```

打开终端提示的本地地址即可预览。若端口被占用，Vite 会提示新的可用端口。

## 打包构建

```bash
npm run build
```

构建产物会生成在：

```text
dist/
```

## 部署到静态托管

这是一个纯前端静态项目，可以部署到任意静态托管平台。

推荐配置：

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 使用较新的 LTS 或当前可用版本

如果平台不自动构建，也可以本地运行 `npm run build` 后上传 `dist/`。

## 添加到主屏幕

项目已加入基础 PWA 支持：

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/icons/icon-192.svg`
- `public/icons/icon-512.svg`

Android Chrome / Edge 在 HTTPS 环境下满足浏览器安装条件后，会显示添加到主屏幕提示。iPhone / iPad Safari 不支持网页主动触发安装弹窗，需要用户手动点击 Safari 的“分享”按钮，再选择“添加到主屏幕”。

本地开发环境下 service worker 不注册，生产构建部署到 HTTPS 后生效。

## 数据文件说明

所有 V1 数据集中放在 `src/data/`：

- `src/data/matches.ts`：比赛列表、时间、地点、阶段、标签、赛程状态、结果状态、晋级状态。当前已整理 72 场小组赛，淘汰赛仍保持路径占位。
- `src/data/teams.ts`：48 支已确认球队和淘汰赛占位槽位，包含 `flagKey`、FIFA 代码等字段
- `src/data/bracket.ts`：淘汰赛路径占位树
- `src/data/sources.ts`：FIFA 官方信息来源链接

国旗静态资源集中放在 `public/flags/`，页面通过 `flagKey` 映射本地 SVG，不依赖运行时外链。

类型定义集中在：

- `src/types.ts`

轻量数据访问出口：

- `src/services/worldCupData.ts`

V1 仍然读取本地静态数据。`services` 层只是为了让组件不要强绑定 `src/data`，未来如果需要 API，可以从这里替换数据来源。

## 数据可信度规则

- 赛程对阵、北京时间、阶段、城市和场馆如果已由 FIFA 官方确认，`matchInfoStatus` 标记为 `official`。
- 比赛尚未开始不等于比赛双方未知。已确认的小组赛必须展示真实球队。
- 比分和比赛结果独立使用 `resultStatus` 管理，未开赛时保持 `pending`。
- 晋级情况独立使用 `advancementStatus` 管理，未产生晋级结果时保持 `pending`。
- 未确认但等待官方核对的数据标记为 `pending`。
- 仅用于页面展示的示例数据标记为 `mock`。
- 不确定球队显示为 `TBD`、`待确认`、`小组第一`、`第 X 场胜者` 等占位。
- 未开始比赛的比分为空或显示 `待确认`。
- 未产生的晋级结果为空或显示 `待确认`。
- 不提前填写冠军。
- 不把 mock 数据当真实数据展示。
- 页面保留官方来源入口。

## 如何更新比赛数据

1. 打开 FIFA 官方赛程页面核对原始信息。
2. 在 `src/data/matches.ts` 更新比赛日期、北京时间、球队、城市、球场等字段。北京时间可通过已确认的 UTC 开球时间换算后填写。
3. 赛程信息已确认时，设置 `matchInfoStatus: 'official'`；未确认则 `pending`；仅作示例则 `mock`。
4. 比赛进行中或已结束时，更新 `matchStatus`（`scheduled` / `live` / `finished`）。
5. 赛后填写 `homeScore`、`awayScore`，并设置 `resultStatus: 'official'`。
6. 淘汰赛产生真实胜者后，再更新 `src/data/bracket.ts` 与相关 `advancementStatus`。

## 官方数据入口

- [FIFA 2026 世界杯主页](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026)
- [官方赛程 / 比分 / Fixtures](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures)
- [官方完整赛程说明](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums)
- [UTC 时间辅助核对](https://wc.dcs.pm/)

## 数据反馈

如发现赛程、北京时间、球队、场馆或晋级信息有误，欢迎邮件反馈：

```text
2064747320@qq.com
```

收到反馈后会人工核对 FIFA 官方来源并更新本地数据。

## 版本与发布

| 版本 | 说明 |
|------|------|
| **v1.0.0** | 稳定收尾版：赛程展示、PWA、分状态数据模型，可静态部署 |
| v2.x | 计划中：筛选增强、更新时间、赛后备注等（见 TODO） |

打标签查看历史版本：

```bash
git tag -l "v*"
git checkout v1.0.0
```

## 未来方向

V1 已完成赛程展示的核心闭环。V2 可能加入轻量“看球记录 / 赛后备注”等功能，但不涉及金钱、竞猜平台、排行榜或用户社区。

如果未来需要多人维护、后台管理或更完整的数据服务，可以考虑增加 Django REST API 后端，例如：

- Django + Django REST Framework
- SQLite 用于开发阶段
- PostgreSQL 或 MySQL 用于正式部署阶段
- Django Admin 用于后台维护比赛、球队、比分和晋级路径

当前阶段不实现后端，不创建数据库，不做登录注册，不接 API。

## 项目背景

这个项目最早来自个人暑期看球小站的想法，后调整为面向中文用户的公开赛程展示网站，主体验服务所有需要快速查看中文赛程的用户。
