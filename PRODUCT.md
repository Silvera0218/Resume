# Product
<!-- impeccable:product-schema 1 -->
## Platform
web
## Users
游戏策划岗位招聘者，阅读个人简历、策划文档和试玩原型。
## Product Purpose
提供可直接浏览、可分享的游戏策划求职作品档案。
## Capabilities and Constraints
GitHub Pages 发布静态站点；档案关闭按钮由本地 React 包生成，桌面图标使用本地 Three.js 包。保留 home、plans、demos、resume、contact 路由、详情弹窗、打印和内容配置，新增 about 自我介绍。全局下沿自动跑跳的像素平台场景无需按键和独立界面；档案在原生模态窗口中打开，阅读时暂停场景。资料目前为待填写框架，禁止虚构经历、成绩与项目。
## Brand Commitments
用户指定参考图和 Supercat 视频中的蓝色 HUD 毛玻璃、手账纸页与像素贴纸游戏风。淡蓝色天空和像素云作为全屏背景；使用 shader 与缓慢旋转的四向天空投影。用户最新要求桌面保持干净背景和底部自动跑跳场景，不显示游戏专属窗口、HUD 或操作键，所有档案窗口均可关闭。笔记本入口触碰时翻开，点击显示自我介绍；文件夹展开、纸张上弹。快捷入口仅图标本身产生选中反馈。贴纸用于图标和游戏角色、不同平台与场景小物；实际按钮采用 CSS 与 React 控件材质。动效参考开源组件的实际实现，保持统一风格。
## Evidence on Hand
真实资料集中在 dist/content.js；现有字体与许可证位于 dist/assets/。
