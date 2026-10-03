# 游戏策划求职作品集

像素街机风的静态作品集框架，适合综合／系统策划岗位。首页以游戏化入口呈现，可分别跳转至简历、策划案、游戏 Demo 和项目详情；示例资料均为待填写框架，不包含虚构履历。

**在线预览：** https://silvera0218.github.io/Resume/

## 填写内容

编辑 `dist/content.js`，填写姓名、简介、邮箱、技能与经历；在 `plans` 和 `demos` 中补充项目内容、封面与链接。未填写的资料会显示为待填写，空链接不会显示为可用入口。

将封面与附件放进 `dist/assets/`，并在内容配置中使用 `./assets/文件名`。`resumeUrl` 对应简历 PDF，`documentUrl` 对应策划文档，`playUrl` 对应在线试玩，`downloadUrl` 对应原型下载，`videoUrl` 对应演示视频。

## 本地预览

以本地 HTTP 服务打开 `dist/index.html`。网页为原生静态文件，无需构建步骤。

## 自动发布

仓库已配置为由 GitHub Actions 发布。推送到 `main` 分支后，工作流会把 `dist/` 发布到 GitHub Pages。

## 字体与视觉来源

英文字体 VT323 与中文像素字体 Fusion Pixel 均按 SIL Open Font License 提供，许可证随字体保存在 `dist/assets/`。按钮交互方向参考 [Uiverse 像素按钮挑战](https://uiverse.io/challenges/pixel-art-button)；界面为原创实现，未复制第三方组件代码。首页像素世界是用于框架展示的装饰插画，不代表个人项目。
