# 游戏策划求职作品集

简约深色像素游戏风的静态作品集框架，适合综合／系统策划岗位。首页以游戏化入口呈现，可分别跳转至简历、策划案、游戏 Demo 和项目详情；示例资料均为待填写框架，不包含虚构履历。

**在线预览：** https://silvera0218.github.io/Resume/

## 填写内容

编辑 `dist/content.js`，填写姓名、简介、邮箱、技能与经历；在 `plans` 和 `demos` 中补充项目内容、封面与链接。未填写的资料会显示为待填写，空链接不会显示为可用入口。

将封面与附件放进 `dist/assets/`，并在内容配置中使用 `./assets/文件名`。`resumeUrl` 对应简历 PDF，`documentUrl` 对应策划文档，`playUrl` 对应在线试玩，`downloadUrl` 对应原型下载，`videoUrl` 对应演示视频。

## 本地预览

以本地 HTTP 服务打开 `dist/index.html`。网页为原生静态文件，无需构建步骤。

## 自动发布

仓库已配置为由 GitHub Actions 发布。推送到 `main` 分支后，工作流会把 `dist/` 发布到 GitHub Pages。

## 字体与视觉来源

英文字体 VT323 与中文像素字体 Fusion Pixel 均按 SIL Open Font License 提供，许可证随字体保存在 `dist/assets/`。首页月夜庭院是使用内置 imagegen 生成的装饰插画，不代表个人项目。背景由原创 WebGL shader 驱动，交互参考 [React Bits Pixel Blast](https://reactbits.dev/backgrounds/pixel-blast)，未复制其组件源码。配色使用 [Radix Colors](https://www.radix-ui.com/colors) 官方 Sage、Jade、Mint 色阶，许可证位于 `dist/assets/palettes/LICENSE`。

## 视觉与动效

`dist/style.css` 负责界面样式，`dist/pixel-shader.js` 负责稀疏像素、局部指针高亮和点击扩散，`dist/motion.js` 负责粒子交互与 FX 开关。右上角 FX 可关闭动效，设置保存在浏览器本地。页面遵循系统的减少动态效果设置；切换到后台时暂停绘制，不支持 WebGL 时使用 Canvas 粒子。菜单支持方向键与回车，档案入口保留直接链接和浏览器返回行为。

视觉参考：[月之暗面招聘](https://careers.kimi.com/)的深色留白与点阵场景、[MotionSites Digital Wave Field Hero](https://motionsites.org/prompts/digital-wave-field-hero)的公开交互方向与 [MotionSites 卡片目录](https://motionsites.org/sections)。实现为项目内的原生 CSS、WebGL 和 Canvas，没有导入付费组件或变更框架。
