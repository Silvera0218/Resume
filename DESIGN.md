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
  glass-foreground: "#39566c"
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
  note-paper: "#fff8db"
  note-foreground: "#74653a"
  glass: "rgba(228,243,254,.43)"
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
  button: "6px"
  file: "4px"
  utility: "7px"
  mobile-window: "9px"
  window: "11px"
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
    padding: "10px 6px"
  desktop-file-selected:
    backgroundColor: "rgba(255,255,255,.74)"
  glass-window:
    backgroundColor: "{colors.glass}"
    rounded: "{rounded.window}"
  memo:
    backgroundColor: "{colors.memo}"
    textColor: "{colors.memo-foreground}"
    padding: "24px 27px 20px"
  demo-chip:
    backgroundColor: "{colors.memo}"
    textColor: "{colors.memo-foreground}"
    rounded: "{rounded.chip}"
    padding: "3px 7px"
---

# Design System: 游戏策划 · 作品手账

## Overview

**Creative North Star: "天空上的作品手账"**

淡蓝像素云铺满屏幕，毛玻璃窗口承载导航与工具，奶油色纸页承载正文。桌面上的文件架、手账、便签和像素贴纸形成轻松的游戏策划工作台。像素轮廓集中在标题、短英文标签和装饰，长段说明保持清晰的无衬线字形。

这套系统服务于招聘者阅读简历、策划文档和试玩原型。错落与倾斜属于桌面构图；手机将入口和内容按阅读顺序展开。当前内容来自 `dist/content.js` 的待填写框架，资料、链接和成果状态由实际内容决定。

**Key Characteristics:**

- 全屏淡蓝像素云，毛玻璃 HUD 窗口与奶油色阅读纸页。
- 中文像素标题、英文像素标签与清晰的无衬线正文。
- 粉色便签、淡紫纸签、装订孔和原创像素贴纸。
- 桌面窗口错落叠放，手机使用原生单列阅读布局。
- FX 本地偏好、系统减少动态效果与后台暂停共同控制天空和粒子。

实现依据为 `dist/index.html`、`style.css`、`app.js`、`routes.js`、`pixel-shader.js` 和 `motion.js`。视觉方向以 PRODUCT.md 和 `.impeccable/surfaces/portfolio.md` 为准。最终首页底部证据为 `.impeccable/review/bottom-fixed.jpg`，其中天空连续覆盖页脚。

## Colors

Sky 的浅蓝负责交互与天空，Pink 负责便签与纸签，Mauve 负责中性分隔和禁用面。Frontmatter 记录当前 sRGB 基准和作者定义的材质颜色；运行时继续使用本地 Radix 文件中的 P3 条件覆盖。

### Primary

- **清透天空蓝**（primary）：主按钮，配深蓝 primary-foreground 文字。悬停使用 primary-hover。
- **墨蓝操作文字**（accent-text）：文字操作、方向箭头、焦点与细小像素标记。
- **薄蓝表面**（sky-surface / sky-hover / sky-pressed / sky-soft）：普通按钮、文档封面、Demo 展示位、技能标签和轻量占位区。
- **水蓝边线**（border / sky-rule / sky-mark）：控件边框、封面描边与像素图形。

### Secondary

- **浅粉便签**（memo）：首页身份便签和 Demo 分类标签。
- **粉色纸边**（memo-border）：便签虚线边框、手账左侧细线与粉色文档封面边线。
- **莓灰文字**（memo-foreground）：便签正文、角色和项目内容状态。
- **粉色纸签**（pink-tab）：策划章节标签；第二张纸签使用 sky-hover。

### Tertiary

- **淡紫纸签**（lavender-tab）：关于我章节标签。第三份文档封面使用作者定义的淡紫底（#eee9f7）和边（#d9cee8）。
- **黄油色便笺**（note-paper / note-foreground）：桌面右侧提醒纸。它属于纸张材质，不用于主要操作。
- **像素文件图标**：基础文件采用 #d5eafa / #7295b1；粉色文件夹采用 #f3d8e6 / #b18ba5；笔记本采用 #fcf9e6 / #a99f76；档案和控制器采用 #e5def3 / #938bb0。

### Neutral

- **蓝灰墨色**（foreground）与 **次要蓝灰**（muted-foreground）：正文和辅助信息。
- **奶油白纸**（paper）：主阅读区域、详情正文与 Toast。Mauve surface 是现有语义面，divider 用于纸页内的细分隔。
- **雾白玻璃**（glass / glass-edge）：窗口半透明底和高亮边缘。标题栏从透白高光渐变到浅蓝。玻璃文字使用 glass-foreground，直接位于天空上的辅助文字使用 ambient-foreground。
- **待添加面**（disabled / disabled-foreground）：缺少试玩、附件、邮箱或 PDF 时的禁用状态。

语义映射：`--background → sky-3`，`--surface → mauve-1`，`--primary → sky-9`，`--primary-foreground → sky-12`，`--border → sky-7`，`--selected → sky-4`，`--hover → sky-3`，`--accent-text → sky-11`，`--memo → pink-3`，`--memo-border → pink-6`。文字与纸张的作者颜色直接保存在 :root。浏览器选区采用 Pink 5 / Pink 12。

天空有独立的作者材质：根元素固定渐变 #acd9f4 → #e6f3fa；CSS 天空中段为 #d4edf9，云为 rgba(255,255,255,.65)。WebGL 天空使用 RGB 向量 (.82,.92,.98) 与 (.59,.79,.94)，云色在 (.84,.91,.965) 与 (.99,.99,1.0) 间混合。Canvas 粒子色为 #629dc2、#b092b1、#8e9dc6。

**The Paper Contrast Rule.** 正文放在纸页或明确的窗口内容面上；天空透光留给玻璃边框与工具区域。

## Typography

**Display Font:** Fusion，加载本地 `fusion-pixel-zh.woff2`，标题回退 Microsoft YaHei、sans-serif。

**Body Font:** Segoe UI、Microsoft YaHei、sans-serif。

**Label/Mono Font:** Pixel，加载本地 `VT323-Regular.ttf`，回退 Fusion、monospace。

中文像素标题建立游戏手账语气，正文栈保证中文段落易读。英文像素标签使用 .04em 字距。字体用 font-display: swap，标题和两份字体在 HTML 中预加载。

### Hierarchy

- **Display**：首页 h1 使用 frontmatter 的 40px / 400 / 1.3；700px 以下为 32px / 1.45。
- **Headline**：分区 h2 使用 30px / 400 / 1.4；手机为 25px。首页“翻开看看”独立使用 19px，手机 18px。
- **Title**：基础 h3 使用 19px / 500 / 1.5。策划条目 17px，Demo 18px；手机分别为 15px、16px。
- **Body**：基础为 14px / 1.7；策划与 Demo 说明 13px，手机 12px。便签 13px / 1.9，手机 12px；简历说明 12px / 1.9。
- **Identity**：首页姓名用 Fusion 20px / 400，手机 17px。简历小节 Fusion 18px。
- **Label**：元信息和分类 10px，辅助说明常用 10–12px；窗口标签继承 13px / 1.3 并叠加 Pixel 字体，主手账文件名继承 13px，手机 12px。按钮默认 12px / 1.5，手机 11px。页脚 11px，手机 10px。
- **Pixel display details**：文档封面英文 23px / 1.05，手机 19px；FX 17px，手机 15px。页脚像素文案 15px，手机 12px。

**The Short Pixel Rule.** 像素字体用于标题、短标签与短句；策划规则、简历经历和详情字段使用正文栈。

## Layout

顶部为横贯视口的 68px 半透明桌面工具栏。工作台最大宽度 1200px，基础列为 `138px minmax(0,1fr) 180px`，间距 24px，左右内边距 24px，上下外边距 24px / 76px。左侧是没有外框的桌面快捷图标，向下错开 91px；手账向下错开 49px、旋转 -0.45deg；右侧小窗略向左叠入。页脚最大宽度 1132px。

手账外层内边距 0 9px 12px，正文纸页内边距 32px 34px 24px 53px、最小高度 594px。左侧装订孔每 58px 重复；粉色边线位于纸页左侧 38px。章节纸签在窗口上方 44px。首页便签最大宽度 440px，底部入口为最小高度 68px 的整行链接。

策划作品按文档条目纵向排列，封面列 126px，列间距 20px；Demo 也是纵向列表，展示位高 190px。简历为 170px 资料栏与正文，间距 26px。详情字段桌面双列，间距 24px。原生 dialog 最大宽度 720px、宽 `calc(100% - 36px)`、最大高 `calc(100dvh - 50px)`。

- **961–1100px**：工作台右列缩至 150px，间距 18px；试玩小窗 173px，提醒纸 135px。
- **700px 以上、960px 以下**：工作台改为两列，最大宽度 930px，间距 22px；隐藏右侧桌面小窗，保留文件架与手账。
- **700px 以下**：工作台改为纵向 flex，最大宽度 580px，左右内边距 13px，间距 27px。文件架成为四个有文字的横向入口，最小高度 76px。文件架取消旋转，手账使用完整宽度；章节纸签、粉色便签和装饰贴纸继续保留。纸页内边距为 27px 20px 22px 35px，装订孔每 56px 重复，边线移至左侧 24px。
- **手机内容**：策划封面列缩至 89px、间距 14px，Demo 画面高 164px。简历改为单列，资料摘要内部以 68px 头像列与文字列排列；资料信息双列。详情字段单列、间距 21px，详情正文内边距 23px 20px。贴纸托盘回到文档流，宽 242px。
- **1500px 以上**：工作台顶部外边距使用 5vh。页面支持的最小布局宽度为 320px。

五个 hash 页面为 home、plans、demos、resume、contact。路由隐藏其他 section，更新标题、文件名与 aria-current，并将焦点移到当前页标题；返回链接显示在内页顶部。正文自适应高度，天空固定铺满视口。

打印样式把根元素和正文设为白色，只显示简历内容。隐藏桌面工具、天空、贴纸、纸签、返回栏、详情框和操作按钮，移除手账阴影与装订装饰；简历使用 180px 资料栏与正文，间距 30px。

## Elevation & Depth

深度来自透明材质、白色细边、环境阴影与纸张之间的实体区别。窗口玻璃模糊为 22px，并带 saturate(1.18)，使用双层边缘、顶部反光和蓝色环境映射；纸张保持实心底。详情 dialog 继续使用 18px 模糊。无 backdrop-filter 支持时，窗口退到 #e7f1f9，dialog 退到 #f7fbff。

### Shadow Vocabulary

- **玻璃环境阴影**（`--glass-shadow: 0 24px 46px -14px rgba(40,79,108,.27),0 5px 12px -4px rgba(40,79,108,.17)`）：窗口和详情框。
- **纸张轻影**（`--paper-shadow: 0 3px 8px rgba(64,85,111,.09),0 18px 28px -20px rgba(64,85,111,.26)`）：主纸页与 Toast。
- **便签贴纸影**（`0 1px 1px rgba(149,100,127,.12),2px 6px 9px -5px rgba(118,79,102,.24),7px 15px 18px -16px rgba(118,79,102,.32)`）：粉色身份便签。
- **提醒纸影**（`1px 1px 1px rgba(135,124,85,.1),3px 8px 13px -5px rgba(109,106,84,.2)`）：右侧黄色便笺。
- **文档提起影**（`0 6px 12px rgba(71,99,125,.12)`）：策划封面悬停。
- **当前桌面图标**：浅蓝半透明选择区域、蓝色虚线边缘，图标本身有贴地阴影。

**The Sky Layer Rule.** 根元素保留固定天空渐变；body 使用透明背景与隔离堆叠上下文。CSS 天空在 z-index 0，WebGL 天空在 1，页面工具与主工作台在 2，粒子在 8。Toast 在 30，原生模态 dialog 使用浏览器 top layer。天空不依赖负 z-index。

## Shapes

玻璃窗口使用 11px 圆角，dialog 为 12px，手机窗口为 9px。纸页使用 3px / 4px / 5px / 3px 四角。按钮与 Demo 展示位为 6px；文件条目为 7px；工具按钮为 8px；分类和技能标签为 3px；文档封面与像素图标以 2px 细小转角保持纸张、像素轮廓。

桌面快捷图标不旋转，右侧小窗父层为 2deg、窗口本体 -1deg，提醒纸 4deg，粉色便签 -1.5deg，贴纸托盘 -4deg。手机手账取消旋转，贴纸托盘缩至 -1deg。胶带具有不规则切边，旋转 -5deg。金属装订环、叠页边缘与像素贴纸的接触阴影建立实体层次。

焦点为 2px Sky 11 轮廓、4px 偏移和 3px 圆角。跳转后程序聚焦的页面标题取消轮廓；用户操作控件继续保留可见焦点。

## Components

### Buttons

浅蓝胶囊矩形，最小高度 44px。默认内边距、色彩与圆角见 frontmatter。普通按钮悬停使用 Sky 4，上移 2px；按下下移 1px并使用 Sky 5。主按钮悬停使用 Sky 10，次按钮默认透白；文字按钮保持透明底、Sky 11 文字，悬停下划线，箭头移动 (2px,-2px)。

禁用按钮和 aria-disabled 链接使用 Mauve 3 / disabled-foreground、默认指针和 pointer-events:none；待添加链接移出 Tab 顺序。FX 与联系入口也是最小高度 44px。现有产品没有输入字段，不建立虚构表单组件。

### Chips

Demo 分类标签使用 Pink 3 与莓灰文字，3px 圆角、3px 7px 内边距。技能占位标签使用 Sky 3，4px 8px 内边距、3px 圆角。这些标签展示分类与内容状态，当前没有筛选行为。

### Cards / Containers

玻璃窗口使用统一的雾白玻璃、高亮边框与环境阴影。标题栏使用透白渐变，主手账标题栏最小高度 41px；两处可拖动窗口的标题栏最小高度 44px。已移除虚假的最小化和最大化图形。

策划条目是纸页内的横向文档行，以 Mauve 5 底线分隔，条目间距 20px。封面最小高 155px，有 Sky 3 / Sky 6 材质和 -2deg 倾斜；第二份文档用 Pink 3 / Pink 6、2deg 倾斜，第三份用淡紫材质。悬停将封面转正并出现文档提起影。Demo 条目间距 26px，底部细线与 190px 预览面建立内容层级。待添加预览明确显示 NO GAME LOADED。

### Navigation

桌面入口是 120px 宽、最小高 100px 的快捷图标，以图标、中文名称和短英文标签纵向排列。悬停上移 3px，按下下移 1px，当前页使用虚线选择区域。方向键循环移动焦点，Enter 使用链接原生激活。手机将入口变为横向图标与文字，保留 aria-current，悬停取消位移。

章节纸签、首页目录和内页返回链接都指向同一组 hash 路由。纸签悬停或当前页向上移动 5px；首页目录悬停使用淡蓝透明底并右移 3px。Contact 由顶部与页脚入口访问，键盘 C 在没有打开 dialog 且不处于编辑控件时跳至 contact。

### Notebook, memo and sticker materials

奶油白正文纸页使用一次性生成的低对比纸纤维纹理，叠页位于正文后方；重复装订孔配合原创几何 SVG 金属环，正文保留 1px 粉色边线。粉色便签用接触阴影、右下折角、半透明切边胶带和轻微旋转承载姓名与策划方向。左下贴纸托盘、右侧试玩窗口和黄色提醒纸延续这一套桌面材质；960px 以下隐藏右侧小窗。

原创栅格资产 `dist/assets/journal-stickers.webp` 是透明的 2×2 贴纸图集：猫与 CRT、控制器、文件夹、星月。CSS 用 background-size:200% 200%、四象限定位和 image-rendering:pixelated 裁出每张贴纸。装饰贴纸不接收指针且有 aria-hidden。生成提示逐字保存在同名 `.webp.json`，工具记录为内置 image_gen。旧庭院与 arcade 图片保留在 assets 中，但当前入口没有加载它们。

### Sky, FX and motion

原创 WebGL shader 将同一世界坐标云场投影到 +X、-X、+Z、-Z 四个竖直面，并随时间缓慢旋转；这是屏幕全幅投影，当前没有 Three.js 或运行时依赖。WebGL 缓冲宽高取视口各自除以 3 向上取整，fragment 使用 3px 网格量化、五阶云密度和 .008 的时间旋转系数。

绘制循环在帧间隔至少 32ms 时更新，目标约 30fps；粒子 Canvas 的 DPR 上限为 1.5。800px 以下 16 个环境粒子，其他宽度 32 个。鼠标细指针移动每 80ms 发射一个 300ms 小粒子；有效操作点击发射 12 个、持续 550ms 的反馈粒子，数量上限 60。键盘触发的点击以控件中心为反馈位置。

通用缓动为 cubic-bezier(.16,1,.3,1)。按钮状态 200ms，文档封面 300ms，纸签 250ms。页面进入为 300ms 的轻微裁切、透明度恢复与 4px 到 0 的横移。FX 关闭时取消页面进入动画并停止天空和粒子；普通 CSS 按钮反馈继续存在。系统 prefers-reduced-motion 关闭所有 CSS 动画与过渡，并优先于 FX 用户偏好。后台暂停绘制。FX 偏好使用 localStorage 的 portfolio-fx。

WebGL 创建失败、编译失败或上下文丢失时显示 CSS 像素云；上下文恢复后保持 CSS 天空，直到重新加载。FX-off 与减少动态效果时保留最后绘制的静态天空或 CSS fallback。

### Movable desktop windows

`dist/desktop.js` 为宽度 961px 以上的试玩窗口与贴纸窗口提供标题栏拖动。方向键每次移动 12px，Enter 或 Escape 恢复位置；失焦、取消指针、丢失捕获与后台切换均结束拖动，视口变化恢复初始位置。位移有范围约束，标题仍可触达，主阅读纸页不参与拖动。手机标题栏回到不可聚焦的普通文字。鼠标移动产生局部玻璃反光，FX-off 与 reduced-motion 停止反光跟随；纸纹只生成一次。

### Detail dialog and status

原生 dialog 使用 12px 玻璃框、18px 模糊和奶油白详情正文。背景遮罩为 rgba(52,85,116,.22)，模糊 5px；顶部关闭栏固定在滚动区域上方。打开时锁定背景滚动并聚焦关闭按钮；关闭按钮、Escape 与点击框外均可关闭，关闭后焦点回到原触发项。

Toast 是底部居中的纸张状态面，距离视口底部 28px，11px 20px 内边距、6px 圆角、12px 字号。出现时 opacity 200ms，并从 10px 位移恢复；FX 状态提示显示 1800ms，role=status 与 aria-live=polite 宣读状态。

资产许可随文件保留：Radix Colors 3.0.0 的成对 Mauve、Sky、Pink 明暗与 alpha CSS 自托管，MIT 文本在 `dist/assets/palettes/LICENSE`；页面当前强制 light。VT323 和 Fusion Pixel 使用 SIL OFL 1.1，本地许可分别在 `FONT-LICENSE.txt`、`fusion-pixel-OFL.txt` 与 `fusion-pixel-licenses/`。贴纸记录为本次原创生成资产；提示 sidecar 没有单独的授权许可字段。

## Do's and Don'ts

### Do:

- **Do** 沿用 Sky / Mauve / Pink 语义映射，并保留作者定义的奶油纸、莓灰文字与雾白玻璃材质。
- **Do** 将正文放在清晰纸页上，将透光和模糊用于窗口外框与工具面。
- **Do** 保持标题、短标签和贴纸的像素轮廓，让长段正文使用无衬线字体。
- **Do** 保持根天空、CSS 天空、WebGL 天空和页面内容的明确层序。
- **Do** 遵循 FX、减少动态效果、后台暂停、键盘焦点与待添加状态。
- **Do** 在手机按阅读顺序展开窗口，保留至少 44px 的操作高度和全部内容路由。

### Don't:

- **Don't** 恢复旧的深色 Sage / Jade / Mint 庭院视觉或将未加载的旧资产写成当前组件。
- **Don't** 用不透明 body 背景盖住天空，或把天空放入负 z-index 层。
- **Don't** 给装饰窗口控件和贴纸添加虚假的操作语义。
- **Don't** 用像素字体排长段策划正文，或让动效成为访问内容的前提。
- **Don't** 将占位文案、空链接或装饰资产描述成真实项目、成绩与经历。
