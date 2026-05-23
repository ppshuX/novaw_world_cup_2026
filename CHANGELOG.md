# Changelog

## [1.0.0] - 2026-05-23

### V1 稳定收尾版

首个可公开部署的稳定版本，聚焦中文用户查看 2026 世界杯赛程。

#### 功能

- 首页：下一场重点比赛、今日/近期赛程、快速导航
- 赛程页：日期 / 阶段 / 小组筛选、球队搜索、比赛详情弹窗
- 晋级树：占位结构，不预填未产生的胜者或冠军
- 来源页：FIFA 官方链接与数据反馈邮箱
- PWA：可添加到主屏幕（manifest、图标、安装说明）

#### 数据与展示

- 本地 TypeScript 数据，无后端与实时 API
- `matchInfoStatus` / `resultStatus` / `advancementStatus` 分状态管理
- 已确认球队 SVG 国旗展示

#### 技术

- Vite + React + TypeScript + TailwindCSS
- 静态构建输出 `dist/`，适配常见静态托管
