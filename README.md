# 游戏策划求职作品集

淡蓝像素天空中的手账桌面，适合综合／系统策划岗位。毛玻璃文件架、奶白纸页、粉色便笺和像素贴纸组成作品入口，可分别浏览简历、策划案、游戏 Demo 和项目详情。资料均为待填写框架，不包含虚构履历。

**在线预览：** [GitHub Pages](https://silvera0218.github.io/Resume/)。页面对应已发布的 `main` 分支。

## 填写内容

编辑 `dist/content.js`，填写姓名、简介、邮箱、技能与经历；在 `plans` 和 `demos` 中补充项目内容、封面与链接。未填写的资料会显示为待填写，空链接不会显示为可用入口。

将封面与附件放进 `dist/assets/`，并在内容配置中使用 `./assets/文件名`。`resumeUrl` 对应简历 PDF，`documentUrl` 对应策划文档，`playUrl` 对应在线试玩，`downloadUrl` 对应原型下载，`videoUrl` 对应演示视频。

## 本地预览

以本地 HTTP 服务打开 `dist/index.html`。网页为原生静态文件，无需构建步骤。

## 自动发布

仓库已配置为由 GitHub Actions 发布。推送到 `main` 分支后，工作流会把 `dist/` 发布到 GitHub Pages。

## 字体与视觉来源

英文字体 VT323 与中文像素字体 Fusion Pixel 均按 SIL Open Font License 提供，许可证随字体保存在 `dist/assets/`。`journal-stickers.webp` 是使用内置 imagegen 生成的原创透明像素贴纸，完整提示词保存在同名 `.json` 文件中，贴纸属于界面装饰。配色使用 [Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) 官方 Sky、Mauve、Pink 明暗及 alpha 色阶，版本固定为 3.0.0，许可证位于 `dist/assets/palettes/LICENSE`。

## 视觉与动效

`dist/style.css` 负责毛玻璃窗口、手账纸页和响应式排版；`dist/pixel-shader.js` 用连续的四向天空投影绘制缓慢旋转的像素云；`dist/motion.js` 负责低频绘制、指针粒子与 FX 开关。右上角 FX 可关闭动效，设置保存在浏览器本地。页面遵循系统的减少动态效果设置，静止时保留天空；切换到后台时暂停绘制。不支持 WebGL 时显示 CSS 像素云，并保留 Canvas 粒子。

桌面文件入口支持方向键与回车，各章节保留直接链接和浏览器返回行为。手机端将文件架排成横向入口，纸页按阅读顺序展开；打印简历时移除天空与桌面装饰。视觉依据为用户提供的毛玻璃手账与像素贴纸参考图，实现使用原生 CSS、WebGL 和 Canvas。
