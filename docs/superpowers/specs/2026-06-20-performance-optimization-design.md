# Performance Optimization Design

**Date:** 2026-06-20
**Scope:** 全量性能优化，覆盖静态资源、代码分割、构建配置、资源提示、Service Worker、数据层

## 目标

- 首次加载总体积从 2.75 MB 降至 < 500 KB
- 首屏 JS 从 302 KB 降至 < 150 KB
- LCP 显著改善
- 二次访问秒开（SW 预缓存）

## 优化清单

### 1. Hero 图片压缩（2.13 MB → ~200 KB）

- 将 `public/images/hero-world-cup-summer.png` 转为 WebP（质量 75-80）
- 保留 PNG 作为 fallback
- Hero 组件使用 `<picture>` 标签：WebP 优先，PNG fallback
- 添加 `<link rel="preload" as="image" href="...webp">` 到 index.html

### 2. 异常 SVG 国旗替换/优化（304 KB → ~50 KB）

- `spain.svg` (149 KB) → 替换为简版红黄红三色条纹国旗 SVG
- `croatia.svg` (80 KB) → 替换为简版棋盘格国旗 SVG
- `saudi-arabia.svg` (24 KB), `egypt.svg` (18 KB), `portugal.svg` (11 KB), `uruguay.svg` (6 KB) → SVGO 优化
- 目标：所有国旗 < 5 KB

### 3. React.lazy 代码分割（302 KB → 首屏 ~150 KB）

- InstallPage、BracketTree、OfficialSources、ScheduleAssistant 改为 `React.lazy` 动态导入
- 首屏组件（Hero、MatchCard、Footer）保持同步导入
- App.tsx 中用 `Suspense` 包裹懒加载组件，添加 loading fallback

### 4. lucide-react 按需引入确认

- 验证 Vite tree-shaking 是否生效（构建后检查未使用图标是否被排除）
- 若未生效，改为显式路径导入 `lucide-react/dist/esm/icons/xxx`

### 5. Vite 构建配置优化

- `vite.config.ts` 添加：
  - `build.target: 'es2020'`（减少 polyfill）
  - `build.rollupOptions.output.manualChunks`：react/react-dom 拆为 vendor chunk
  - 确认 `build.cssCodeSplit: true`

### 6. HTML 资源预加载

- `index.html` 添加：
  - `<link rel="preload" as="image" href="/images/hero.webp" type="image/webp">`
  - `<link rel="modulepreload" href="/assets/index-[hash].js">`（构建后由 Vite 自动注入，确认配置）

### 7. Service Worker 增强

- `public/sw.js` install 阶段预缓存构建产物（JS/CSS/hero 图片）
- 使用 cache-first 策略处理静态资源
- 网络请求保持 network-first

### 8. 数据层缓存

- `src/services/worldCupData.ts` 中 `getMatches()` 添加 memoize，避免每次调用都执行 merge

## 验证

- `npm run build` 通过
- 对比优化前后 dist 体积
- 确认所有页面功能正常
