# Portfolio surface

Mode: Experience，保留招聘者阅读简历、策划案和试玩原型的清晰路径。

Direction: 用户固定的淡蓝像素天空、原创贴纸入口、透蓝 HUD 毛玻璃和奶油手账纸。以 PRODUCT.md 与实际页面为准，采用 code-led 实现。先前 seed 52b12828 已被最新构图要求覆盖，无独立 concept comp。

First viewport: 干净的全屏淡蓝像素云桌面、顶部悬浮工具栏、四个带中文标签的贴纸入口与下沿自动跑跳场景。首页不显示 hero、常驻手账、装饰辅助窗口或贴纸收纳窗。场景没有前景游戏窗口、HUD、操作键和手动输入。

Desktop: body 纵向 flex 使桌面占据剩余视口。701px 及以上，入口在桌面左侧纵排，区域宽 112px，单个入口宽 108px、最小高 96px，贴纸区域为 54px。700px 以下横排四入口，贴纸区域为 44px，隐藏英文短标签。选中、悬停、按下与焦点反馈只作用于图标。

Reading: 笔记本打开 #about 自我介绍，文件夹进入 #plans，控制器进入 #demos，资料卡进入 #resume，顶部联系入口进入 #contact。#home 关闭档案并显示桌面。档案是最大宽 820px 的原生 dialog，最大高 100dvh - 32px，手机为 100dvh - 16px。粘性标题栏保留文件名与至少 44px 高的 React/CSS HUD 关闭按钮；Escape 与返回桌面关闭窗口并恢复入口焦点。四张章节纸签依次为自我介绍、策划作品、游戏原型、个人简历。详情也使用可关闭原生 dialog，简历保留打印版。

Signature interaction: 一个共享本地 Three.js 画布在状态变化时绘制贴纸入口。笔记本悬停、焦点或触碰时沿封面铰链翻开并显示 open-book 图像；文件夹展开、文档向上弹出。降级保留同一贴纸的 SVG 图像。天空 shader 保留缓慢旋转的四向云场投影。FX、减少动态效果和后台暂停保持统一，内容不依赖动画。

Global scene: 透明 Canvas 全局固定在下沿，高 180px、z-index 1，位于桌面内容之后，pointer-events:none，无键盘监听。原创快递猫无尽自动跑跳，前方按整块平台生成地形，身后回收地块与收集状态；坐标定期重置以维持精度。角色，使用 runA/runB/jump；平台在草地、花甸和云台间变化，加入花、蘑菇、灌木、蜗牛、邮箱、指示牌、晶簇和路边星门。阅读任何档案或详情时暂停，FX 关闭、减少动态效果与隐藏页面同样暂停。

Materials: HUD 外框 18px 模糊、透蓝反光、白色双边和抬起标题栏。正文为实心奶油纸，保留装订孔、叠页、粉色便签与折角。Sky、Mauve、Pink 使用现有本地 Radix 3 调色板，Fusion/VT323 用于标题和短标签，无衬线正文负责阅读。真实按钮采用 CSS 与 React。

Assets and content: desktop-stickers-v2.png 的 12 张贴纸与 world-stickers.png 的 16 张变体为原创透明像素资产，atlas manifest 管理裁切，PNG 内嵌提示和同名 JSON 记录生成来源。dist/content.js 目前为待填写框架，姓名、介绍、经历、作品和附件状态遵循配置。

References: 用户截图 C:/Users/caohua/AppData/Local/Temp/codex-clipboard-2a39cee3-c5cd-4a36-881a-9bad4fa40831.jpg 与 Supercat 手账视频提供材质方向；最新干净桌面要求决定构图。README 所列 React Bits TiltedCard/PixelSnow 和 Animate UI Button 是参考技术，当前为本地实现。

Window motion: 档案从对应图标、详情从所点按钮的位置缩放到原生窗口，420ms 指数缓出；减少动态效果时只用 100ms 淡入。关闭取消正在进行的动画。

Visual evidence: .impeccable/review/endless-desktop.png、endless-about.png、endless-mobile.png 与 endless-mobile-about.png 记录无尽场景、完整图块与最新文案。此前  .impeccable/review/global-desktop.png、global-desktop-about.png、global-mobile.png、global-mobile-about.png、user-703.png 与 global-notebook-hover.png 记录当前桌面、阅读窗口、窄屏和笔记本交互。
