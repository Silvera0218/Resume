---
name: 游戏策划 · 作品手账
description: 淡蓝像素云天空上的毛玻璃桌面与奶油色手账
colors:
  primary: "#7ce2fe"
  primary-hover: "#74daf8"
  primary-foreground: "#1d3e56"
  accent-text: "#00749e"
  sky-surface: "#e1f6fd"
  sky-hover: "#d1f0fa"
  sky-pressed: "#bee7f5"
  sky-soft: "#f1fafd"
  border: "#8dcae3"
  sky-rule: "#a9daed"
  sky-mark: "#60b3d7"
  foreground: "#334657"
  ambient-foreground: "#334f64"
  glass-foreground: "#334f64"
  muted-foreground: "#596774"
  paper: "#fffdf9"
  surface: "#fdfcfd"
  divider: "#e3dfe6"
  disabled: "#f2eff3"
  disabled-foreground: "#68717b"
  memo: "#fee9f5"
  memo-border: "#efbfdd"
  memo-foreground: "#75475f"
  pink-tab: "#fbdcef"
  lavender-tab: "#ece5f4"
  glass: "rgba(173,218,249,.3)"
  glass-edge: "rgba(255,255,255,.92)"
  glass-title: "rgba(255,255,255,.55)"
  secondary-button: "rgba(255,255,255,.6)"
typography:
  display:
    fontFamily: "Fusion, Microsoft YaHei, sans-serif"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0"
  headline:
    fontFamily: "Fusion, Microsoft YaHei, sans-serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.4
  title:
    fontFamily: "Segoe UI, Microsoft YaHei, sans-serif"
    fontSize: "19px"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Segoe UI, Microsoft YaHei, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  pixel-label:
    fontFamily: "Pixel, Fusion, monospace"
    letterSpacing: ".04em"
rounded:
  icon: "2px"
  chip: "3px"
  preview-icon: "4px"
  button: "5px"
  file: "4px"
  close: "6px"
  utility: "7px"
  paper-wide: "8px"
  mobile-window: "9px"
  toolbar: "10px"
  window: "11px"
  detail: "12px"
spacing:
  tight: "4px"
  small: "8px"
  control: "10px"
  compact: "12px"
  body: "16px"
  row: "20px"
  window: "24px"
  columns: "26px"
  dialog: "30px"
components:
  button:
    backgroundColor: "{colors.sky-surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  button-hover:
    backgroundColor: "{colors.sky-hover}"
  button-active:
    backgroundColor: "{colors.sky-pressed}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.secondary-button}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.button}"
    padding: "10px 16px"
  button-disabled:
    backgroundColor: "{colors.disabled}"
    textColor: "{colors.disabled-foreground}"
  desktop-file:
    textColor: "{colors.foreground}"
    rounded: "{rounded.file}"
    padding: "6px 4px"
  glass-window:
    backgroundColor: "{colors.glass}"
    rounded: "{rounded.window}"
  memo:
    backgroundColor: "{colors.memo}"
    textColor: "{colors.memo-foreground}"
    padding: "24px 27px 22px"
  demo-chip:
    backgroundColor: "{colors.memo}"
    textColor: "{colors.memo-foreground}"
    rounded: "{rounded.chip}"
    padding: "3px 7px"
---

# Design System: 游戏策划 · 作品手账

## 页面内部布局

桌面入口以两列大贴纸成组摆放，配一张欢迎便笺，形成明确的视觉重心；手机将便笺缩成横条。窗口关闭键采用 React 内层键帽，FX 使用滑动开关，章节与阅读入口使用折角纸签，原型筛选使用带状态点和按下反馈的游戏机按键。未配置的附件以轻量状态文字呈现。该层样式位于 `dist/tactile-desktop.css`。

外层保留现有的透蓝毛玻璃档案窗口和章节标签。自我介绍为奶油色名片，身份、简介和联系资料优先；策划作品为文档目录与纸质文件列表；游戏原型为浅紫 CSS 游戏机外壳，屏幕内有类型筛选、搜索和原型卡片；个人简历为装订手账，使用粉色资料便签、技能纸签和经历时间线。只在简历中保留装订孔与边线，其他页面使用各自的物件结构。页面样式由 `dist/page-layouts.css` 管理，调色板、字体和贴纸来源继续保持一致。

## Overview

**Creative North Star: "天空上的作品手账"**

淡蓝像素云铺满屏幕，原创贴纸标记入口，毛玻璃承载工具与档案外框，奶油色纸页承载正文。画面保留宽阔天空，资料在需要阅读时打开。像素字用于标题和短标签，长段说明使用清晰的无衬线正文。

白色双边玻璃、装订孔、叠页和贴纸接触阴影形成材质层次。入口动效与下沿自动场景提供游戏气氛，静态状态保留同样的内容和阅读路径。

**Key Characteristics:**

- 淡蓝像素天空、透蓝玻璃与实心奶油纸。
- 原创贴纸、短像素标签和无衬线正文。
- 清晰的桌面入口与按需打开的阅读窗口。
- 图标局部反馈、有限的纸页转场与统一 FX 偏好。

实现依据为 dist/style.css、dist/index.html、路由、React 控件和 Three 图标组件。首页构图与路由约束记录在 .impeccable/surfaces/portfolio.md，内容以 PRODUCT.md 和 dist/content.js 为准。

## Colors

Sky、Mauve、Pink 构成交互、中性和纸签色系。Frontmatter 记录当前 sRGB 值与作者材质色；运行时保留本地调色板的 P3 条件覆盖，页面为 light。

### Primary

- **清透天空蓝**（primary / primary-hover）：主按钮及悬停态，配 primary-foreground 文字。
- **薄蓝表面**（sky-surface / sky-hover / sky-pressed）：常规按钮默认、悬停与按下背景。
- **墨蓝操作文字**（accent-text）：文字操作、方向箭头与键盘焦点；border 用于操作边缘。

### Secondary

- **粉色手账纸**（memo / memo-border / memo-foreground）：身份便签、分类标签与纸张细节。
- **粉色与淡紫纸签**（pink-tab / lavender-tab）：章节区分，与薄蓝纸签配合。

### Neutral

- **蓝灰墨色**（foreground / muted-foreground）：正文与辅助信息。ambient-foreground 和 glass-foreground 用于天空及玻璃上的小字。
- **奶油白纸**（paper）：阅读正文、详情与状态提示。surface 和 divider 提供浅中性面与内部分隔。
- **透蓝玻璃**（glass / glass-edge）：窗口基底与白色高光边。工具栏采用更薄的蓝白透明面。
- **待添加面**（disabled / disabled-foreground）：邮箱、PDF、附件或试玩链接未填写时的禁用态。

**The Paper Contrast Rule.** 长段正文放在实心纸页上，天空透光留给工具与窗口边框。

## Typography

**Display Font:** 本地 Fusion（fusion-pixel-zh.woff2），回退 Microsoft YaHei、sans-serif。**Body Font:** Segoe UI、Microsoft YaHei、sans-serif。**Label/Mono Font:** 本地 Pixel（VT323-Regular.ttf），回退 Fusion、monospace。两份像素字体预加载，使用 font-display: swap。

当前页面没有 hero 或常驻首页大标题。Frontmatter display 记录现有 h1 基础样式；当前章节使用 headline，700px 以下为 (25px)。h3 基础使用 title，策划条目 (17px)、Demo 条目 (18px)，手机分别为 (15px)、(16px)。正文基础使用 body；条目说明通常 (13px)，手机 (12px)，简历说明为 (12px / 1.9)。

工具栏品牌为 Fusion (18px)，手机 (15px)。桌面入口中文 (11px)、英文短标签 (10px)，手机只保留 (10px) 中文标签。窗口文件名为 Pixel，宽屏 (13px)、手机 (12px)。普通按钮 (12px / 1.5)，手机 (11px)；分类与元信息通常 (10px)。

**The Short Pixel Rule.** 像素字体用于标题、短标签与短句；策划规则、简历经历和详情字段使用正文栈。

## Layout

全屏固定天空与页面内容分层。body 使用纵向 flex 和 (100dvh) 最小高度，桌面占据工具栏下方剩余空间。悬浮工具栏最大宽度 (1152px)，宽度为视口减 (48px)，顶部外边距 (16px)，最小高度 (60px)。具体快捷入口与自动场景位置见 surface brief。

档案是居中的原生模态窗口，最大宽度 (820px)，宽度为视口减 (32px)，最大高度为 100dvh - 32px。窗口内部滚动，顶部关闭栏粘住，关闭按钮最小高 (44px)。700px 以下窗口宽度和最大高度分别减 (16px)，外壳圆角为 mobile-window。章节纸签位于标题栏之后，允许换行，高 (40px)。

纸页常规内边距 (32px 34px 24px 53px)，手机为 (27px 20px 22px 35px)。装订孔与粉色边线占据左侧留白，纸页高度由内容决定。策划条目使用 (126px) 封面列、(20px) 列间距，手机为 (89px)、(14px)。Demo 纵向排列，间距 (26px)，预览高 (190px)，手机 (164px)。简历使用 (170px) 资料栏与 (26px) 间距，手机单列。

详情框最大宽 (720px)，视口左右留 (36px)，最大高 100dvh - 50px；正文内边距 (30px)，手机 (23px 20px)。详情字段双列、间距 (24px)，手机单列、间距 (21px)。最小布局宽度为 (320px)。打印只保留白底简历，资料栏 (180px)、列间距 (30px)，移除天空、工具、纸签、装订装饰与操作按钮。

## Elevation & Depth

玻璃使用蓝色透明基底、斜向薄反光、白色双边与抬起的标题栏。窗口为 (18px) 模糊与 saturate(1.28)，工具栏为 (12px) 模糊。纸张使用实心背景、叠页与低对比纹理；贴纸保留白色裁切边和接触阴影。无 backdrop-filter 支持时沿用浅蓝实心回退。

- **玻璃环境阴影**：0 24px 46px -14px rgba(40,79,108,.27),0 5px 12px -4px rgba(40,79,108,.17)。
- **纸张轻影**：0 3px 8px rgba(64,85,111,.09),0 18px 28px -20px rgba(64,85,111,.26)。
- **便签贴纸影**：0 1px 1px rgba(149,100,127,.12),2px 6px 9px -5px rgba(118,79,102,.24),7px 15px 18px -16px rgba(118,79,102,.32)。

**The Sky Layer Rule.** body 保持透明并隔离堆叠。CSS 天空在 (z-index 0)，WebGL 天空和下沿自动场景在 (1)，桌面内容在 (2)，粒子在 (8)。原生模态窗口使用浏览器 top layer。

## Shapes

玻璃档案为 (11px) 圆角，手机 (9px)，详情框 (12px)，工具栏 (10px)。普通按钮 (6px)，工具按钮 (7px)，档案关闭按钮 (5px)，纸签 (4px)，分类和技能标签 (3px)。纸页基本四角为 (3px / 4px / 5px / 3px)，961px 以上为 (8px)。

档案正向放置；粉色便签轻转 (-1.5deg)，胶带具有不规则切边，右下折角和装订孔保留手账触感。普通控件焦点为 (2px) 墨蓝轮廓、(4px) 偏移、(3px) 圆角。桌面快捷入口把轮廓限定在图标；程序聚焦的阅读标题取消轮廓。

## Components

### Buttons

浅蓝矩形按钮最小高 (44px)，保留细边与顶部高光。常规按钮悬停上移 (2px)，按下下移 (1px)。React 生成的档案和详情关闭按钮使用 CSS HUD 材质：蓝白渐变、白色边缘、滑过反光与按下凹影，保留 ESC 标签。禁用按钮和链接使用待添加面，停止点击与指针反馈。

### Chips

Demo 分类使用粉纸与莓灰文字，内边距见 demo-chip；技能标签使用薄蓝表面、(4px 8px) 内边距。这些标签表示类别和内容状态，当前没有筛选行为。

### Cards / Containers

策划与 Demo 是纸页内的纵向条目，以浅中性底线分隔。策划封面轻微倾斜，悬停转正；Demo 预览有浅蓝展示框，缺少内容时显示待添加状态。身份便签沿用粉纸、胶带、折角和贴纸，位于自我介绍档案内部。

### Navigation

四个快捷入口使用贴纸、中文名称和英文短标签，手机横排并隐藏英文。悬停、按下、选中和焦点反馈集中在图标，文字及整个入口不增加选中框。方向键循环移动焦点，Enter 原生激活链接。档案内四张纸签连接自我介绍、策划作品、游戏原型、个人简历，悬停和当前页上移 (2px)。返回桌面关闭档案。

### Sticker icons and ambient scene

入口使用一个共享的本地 Three.js 透明画布，状态变化时绘制，过渡结束即停。笔记本在悬停、焦点或触碰时沿封面铰链翻开，并显示打开的纸页；文件夹展开、文档向上弹出。WebGL 失败时保留同一贴纸的 SVG 图像，减少动态效果时直接显示对应状态。贴纸画布不抢占指针。

原创透明图集 desktop-stickers-v2.png 提供 (12) 张桌面与场景贴纸，world-stickers.png 提供 (16) 张姿态、平台和小物变体。两份 atlas manifest 管理裁切；生成提示保存在 PNG 内嵌元数据与同名 JSON sidecar。保留像素边缘、白色裁切边与透明留白。手账装饰另用 journal-stickers.webp 四象限图集。真实按钮由 CSS 与 React 控件绘制。

### Reading windows and motion

档案和详情使用原生 dialog、可见关闭按钮与 Escape，关闭后焦点返回触发入口。打开任何阅读窗口时暂停下沿自动场景。FX 偏好、减少动态效果和后台状态共同控制天空、粒子、图标过渡与自动场景，减少动态效果优先。通用缓动为 cubic-bezier(.16,1,.3,1)，HUD 反馈 (180ms)，普通按钮 (200ms)，纸签 (250ms)，窗口从触发图标或按钮放大展开 (420ms)，减少动态效果时淡入 (100ms)，纸页切换 (300ms)。静态回退保持内容可达。

## Do's and Don'ts

### Do:

- **Do** 延续 Sky、Mauve、Pink 语义色和透蓝玻璃、奶油纸、原创贴纸材质。
- **Do** 将长段阅读内容放在实心纸页，保留像素标题与无衬线正文的分工。
- **Do** 保持图标局部反馈、清晰键盘焦点、可关闭阅读窗口与打印简历。
- **Do** 保留 FX、减少动态效果、后台暂停与静态回退。

### Don't:

- **Don't** 用不透明 body 背景覆盖天空，或把天空放入负 z-index。
- **Don't** 为贴纸装饰增加虚假按钮语义，或用栅格贴纸替代真实控件。
- **Don't** 用像素字体排长段正文，或让动效成为访问内容的前提。
- **Don't** 把待填写资料、空链接或装饰场景描述成真实项目与成绩。
