# 游戏策划求职作品集

淡蓝像素天空中的作品桌面，适合综合／系统策划岗位。桌面保留快捷贴纸图标和底部自动跑跳的原创像素场景；自我介绍、简历、策划案、游戏 Demo 和项目详情均通过可关闭的毛玻璃档案窗口浏览。资料均为待填写框架，不包含虚构履历。

**在线预览：** [GitHub Pages](https://silvera0218.github.io/Resume/)。页面对应已发布的 `main` 分支。

## 填写内容

编辑 `dist/content.js`，填写姓名、简介、邮箱、技能与经历；在 `plans` 和 `demos` 中补充项目内容、封面与链接。未填写的资料会显示为待填写，空链接不会显示为可用入口。

将封面与附件放进 `dist/assets/`，并在内容配置中使用 `./assets/文件名`。`resumeUrl` 对应简历 PDF，`documentUrl` 对应策划文档，`playUrl` 对应在线试玩，`downloadUrl` 对应原型下载，`videoUrl` 对应演示视频。

## 本地预览

已提交的 `dist/` 可直接用本地 HTTP 服务预览。修改 `src/hud-controls.jsx` 或 `src/sticker-icons.js` 后，执行 `npm ci`、`npm run build` 生成本地 React / Three.js 包，再刷新页面。其余内容配置和静态 CSS 无需额外构建。

## 自动发布

仓库已配置为由 GitHub Actions 发布。推送到 `main` 分支后，工作流会构建 HUD、运行平台游戏验证，再把 `dist/` 发布到 GitHub Pages。

## 字体与视觉来源

英文字体 VT323 与中文像素字体 Fusion Pixel 均按 SIL Open Font License 提供，许可证随字体保存在 `dist/assets/`。`journal-stickers.webp` 是使用内置 imagegen 生成的原创透明像素贴纸，完整提示词保存在同名 `.json` 文件中，贴纸属于界面装饰。配色使用 [Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) 官方 Sky、Mauve、Pink 明暗及 alpha 色阶，版本固定为 3.0.0，许可证位于 `dist/assets/palettes/LICENSE`。

## 视觉与动效

`dist/style.css` 负责毛玻璃窗口、手账纸页和响应式排版；`dist/pixel-shader.js` 用连续的四向天空投影绘制缓慢旋转的像素云；`dist/motion.js` 负责低频绘制、指针粒子与 FX 开关。`dist/desktop.js` 提供一次性纸纤维纹理。右上角 FX 可关闭动效，设置保存在浏览器本地。页面遵循系统的减少动态效果设置，静止时保留天空；切换到后台时暂停绘制。不支持 WebGL 时显示 CSS 像素云，并保留 Canvas 粒子。

左侧入口使用原创贴纸图集，支持方向键与回车；笔记本入口打开自我介绍，其余档案在原生模态窗口中打开，关闭或按 Escape 后返回桌面，保留直接链接与浏览器返回行为。笔记本触碰时翻开，文件夹展开、纸张向上弹出，均使用共享 Three.js 画布，静止时不持续渲染。WebGL 不可用时保留静态图标。

`dist/platform-game.js` 在全局页面下沿绘制透明的自动平台场景，角色自动跳过缺口、障碍和敌人，持续生成前方地形并回收身后的地块，采用无尽模式。无需游戏窗口、HUD 或操作键，画布不接收指针和键盘输入。打开档案、切到后台、关闭 FX 或启用减少动态效果时暂停。`src/hud-controls.jsx` 提供 React 档案关闭按钮，材质、按压与反光由 CSS 实现。`tests/platform-game.test.cjs` 使用实际游戏逻辑验证手机与桌面宽度下的10 分钟持续运行、地形回收和坐标归零、单个动画循环、阅读／减少动效／后台暂停和无输入控制。

新图集含 12 个原创透明贴纸资源，生成和清理提示词保存在 `dist/assets/desktop-stickers-v2.png.json`，运行时裁切信息位于 `dist/sticker-atlas.js`。React、React DOM 与 Three.js 的许可证随本地包保存在 `dist/ui/LICENSES.txt`。动效参考 [React Bits TiltedCard](https://github.com/DavidHDev/react-bits/blob/main/src/content/Components/TiltedCard/TiltedCard.jsx) 的指针倾斜思路与 [Animate UI Button](https://animate-ui.com/docs/primitives/buttons/button) 的悬停 / 按压反馈，本项目按像素 HUD 的材质和交互重新实现。

`dist/assets/world-stickers.png` 补充 16 个原创资源：角色跑步／跳跃姿态、翻开的笔记本、草地／花田／云台／木桥、植物、蜗牛、邮箱、路标、星门与水晶。场景按位置换用不同平台和小物；提示词保存在同名 `.json` 并嵌入 PNG 元数据，运行时裁切信息位于 `dist/world-atlas.js`。

背景效果同时对照 [React Bits PixelSnow](https://github.com/DavidHDev/react-bits/blob/main/src/content/Backgrounds/PixelSnow/PixelSnow.jsx) 的像素量化、颗粒尺度和深度参数；本页面保留自己的天空投影与低频粒子实现。参考索引记录具体技法，避免把不同组件库的视觉样式混在一起。

窗口打开由 `dist/window-motion.js` 计算图标与窗口的实际位置，使用 Web Animations API 展开；关闭时向原入口收回（300ms），减少动态效果时淡出（90ms）。重复关闭复用同一动画，重新打开会取消尚未结束的关闭。贴纸按原始比例绘制，地块使用完整图块，避免段尾截断。

角色动作图集 `dist/assets/courier-motion.png` 含四帧跑步、起跳和落地姿态，使用内置 imagegen 生成并保留透明通道，完整提示与来源记录在同名 JSON；`dist/courier-atlas.js` 保存裁切框。角色落地时轻微压缩、扬尘，星星沿跳跃路线排列，收集后上浮淡出。桥梁连接部分路段，远处植物使用更慢的视差；场景仍为静音、无控件的自动背景。
