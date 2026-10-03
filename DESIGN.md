---
name: 游戏策划 · 作品档案
description: 简约深色背景中的像素游戏策划作品档案
colors:
  sage-1: "#101211"
  sage-2: "#171918"
  sage-3: "#202221"
  sage-4: "#272a29"
  sage-6: "#373b39"
  sage-7: "#444947"
  sage-8: "#5b625f"
  sage-11: "#adb5b2"
  sage-12: "#eceeed"
  jade-2: "#121c18"
  jade-3: "#0f2e22"
  mint-1: "#0e1515"
  mint-3: "#092c2b"
  mint-7: "#1e685f"
  mint-8: "#277f70"
  mint-9: "#86ead4"
  mint-10: "#a8f5e5"
  mint-11: "#58d5ba"
  mint-12: "#c4f5e1"
typography:
  display:
    fontFamily: "Fusion, monospace"
    fontSize: "clamp(38px, 4.1vw, 60px)"
    fontWeight: 400
    lineHeight: 1.32
    letterSpacing: "0"
  headline:
    fontFamily: "Fusion, monospace"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1.45
  title:
    fontFamily: "Microsoft YaHei, PingFang SC, sans-serif"
    fontSize: "21px"
    fontWeight: 500
    lineHeight: 1.7
  body:
    fontFamily: "Microsoft YaHei, PingFang SC, sans-serif"
    fontSize: "14px"
    lineHeight: 1.7
  pixel-label:
    fontFamily: "Pixel, monospace"
    fontWeight: 400
    lineHeight: 1.1
rounded:
  square: "0"
spacing:
  small: "8px"
  compact: "12px"
  regular: "16px"
  panel: "20px"
  grid: "24px"
  section: "32px"
components:
  button:
    backgroundColor: "{colors.sage-3}"
    textColor: "{colors.sage-12}"
    rounded: "{rounded.square}"
    padding: "10px 17px"
  button-primary:
    backgroundColor: "{colors.mint-9}"
    textColor: "{colors.mint-1}"
    padding: "10px 17px"
    rounded: "{rounded.square}"
  button-primary-hover:
    backgroundColor: "{colors.mint-10}"
  save-slot:
    backgroundColor: "{colors.sage-2}"
    textColor: "{colors.sage-12}"
    padding: "10px 17px"
  save-slot-selected:
    backgroundColor: "{colors.jade-3}"
  plan-card:
    backgroundColor: "{colors.sage-2}"
    textColor: "{colors.sage-12}"
    padding: "20px"
    rounded: "{rounded.square}"
---

# Design System: 游戏策划 · 作品档案

## Overview

**Creative North Star: “安静的像素档案”**

这套界面让招聘者直接阅读策划文档、试玩原型和个人简历。深色底面留出空间，像素字体、方形标记和档案选择菜单提供游戏感。月夜庭院收在首页的一块局部插画中，背景保持简约。

动效由低对比像素粒子、右侧抖动轨道、指针反馈和轻微卡片反馈组成。文字区域保持清晰，内容密度以可读性为准。现有资料为待填写框架，视觉设计不添加虚构经历或成果。

**Key Characteristics:**

- Sage 深色底面，Jade 选中区域，Mint 操作与状态提示。
- 中文像素标题搭配清晰的中文正文字体。
- 方形卡片、细边框和少量阶梯切角。
- 局部庭院插画，稀疏背景动效，全局 FX 开关。

## Colors

配色以带绿调的深灰为基底，薄荷亮色集中在可操作区域和游戏标记上。

### Primary

- **Mint 9 / 操作薄荷**：主按钮、导航选中线、焦点轮廓和完成标记。
- **Mint 10 / 悬停薄荷**：主按钮悬停。
- **Mint 12 / 浅薄荷文字**：首页强调标题、像素标签、封面字与地图标记。
- **Mint 11 / 状态薄荷**：资料角色与弹窗状态文本。
- **Mint 7 / Mint 8**：交互边框、像素图形和选中档案描边；Mint 1 用作亮色按钮的深色文字。

### Secondary

- **Jade 3 / 庭院深绿**：档案选中背景、首份文档封面、头像底面。Jade 2 用于 Demo 画面底色，Mint 3 用于第二份文档封面。

### Neutral

- **Sage 1 / 夜色底面**：页面背景。
- **Sage 2 / 档案底面**：卡片、插画外框、资料栏和弹窗。
- **Sage 3 / 抬高底面**：工具条、次级按钮、状态标签与悬停卡片。
- **Sage 4**：次级按钮悬停。Sage 6 用于分隔线，Sage 7 用于更明显的边框，Sage 8 用于未选中标记。
- **Sage 12 / 正文**与 **Sage 11 / 次要文字**区分主次信息。

Frontmatter 记录本项目使用的 sRGB 值。运行时的唯一颜色来源是 `dist/assets/palettes/` 中导入的 Radix 色阶；支持 P3 的设备使用这些文件已有的条件覆盖。新增界面使用 `--bg`、`--surface`、`--raised`、`--text`、`--muted`、`--line`、`--accent` 等现有语义变量，避免另建相近色值。shader 的颜色向量与 Canvas 粒子色在脚本中独立定义，保持低对比的绿灰与薄荷方向。

## Typography

**Display Font:** Fusion，对应本地 `fusion-pixel-zh.woff2`，回退 monospace。

**Body Font:** Microsoft YaHei、PingFang SC、sans-serif。

**Label/Mono Font:** Pixel，对应本地 VT323；用于英文游戏标签、键帽、计数和控制提示。

中文大标题呈现像素轮廓，长段落采用中文无衬线字体。像素英文标签尺寸比同层级中文稍大，便于读取。

- **Display**：首页标题使用 frontmatter 的 clamp；1100px 以下为 42px，800px 以下为 44px，420px 以下为 38px。
- **Headline**：桌面分区标题 32px；800px 以下 26px，420px 以下策划分区标题 24px。
- **Title**：常规卡片标题 21px / 500；紧凑文档卡片为 19px，并随窄屏调整。
- **Body**：卡片正文 14px，策划卡片行高 1.85。首页说明 15px / 1.9，宽度上限 34ch；简历占位说明上限 70ch。
- **Pixel labels**：常见尺寸 17–25px；封面大字为 64px，按卡片类型和屏宽缩小。元信息与辅助说明为 11–13px，使用正文栈。

## Layout

主内容与页脚宽度上限 1200px，页头上限 1296px。桌面首页为 `1fr 1.12fr` 双栏，默认间距 80px；在 1380px 和 1100px 断点分别收至 56px、36px。页头高度 88px。

桌面策划列表为 `1.15fr 1fr`，首卡跨两行，其余卡片使用窄封面加文字的横向布局。Demo 为等宽双栏。简历为 320px 资料栏加正文，间距 56px。分区标题、返回栏和细分隔线建立页面层级。

800px 以下首页、Demo、策划列表和简历变为单列，页头导航换至独立一行。主内容左右留 24px；420px 以下留 20px。策划次卡仍保留横向封面。资料信息在 800px 以下先变双列，在 420px 以下再变单列。弹窗为 `min(800px, calc(100% - 32px))`，最大高度 88dvh，详情字段在 800px 以下单列。

保留 home、plans、demos、resume、contact 五个 hash 路由、详情弹窗、内容配置和打印功能。打印简历使用现有白底样式与中文正文字体。

## Elevation & Depth

界面用相邻深色底面、1px 描边和小型像素角标建立层级。局部庭院外框使用 `0 20px 50px #0004`，卡片交互使用 `0 10px 28px #0003`，详情弹窗使用 `0 24px 80px #0008`。卡片另有低对比的薄荷斜向底色，文档封面悬停出现轻微扫光。背景 shader 位于内容下方，左侧阅读区渐淡。

## Shapes

普通卡片、按钮、标签与弹窗保持直角。品牌标记、头像、ENTER 按钮和部分像素装饰使用既有 `--pixel-shape` 阶梯多边形，切角单位为 8px / 4px。档案选择指示为小型阶梯箭头，完成灯为短矩形。焦点使用 2px Mint 轮廓，默认偏移 5px；ENTER 按钮聚焦时取消裁切，使轮廓完整。

## Components

### Buttons

通用按钮最小高度 44px，内边距 10px 17px。主按钮使用 Mint 9 底色与 Mint 1 文字，悬停切换 Mint 10；次级按钮使用 Sage 3，悬停 Sage 4。按下向下移动 2px。禁用按钮使用次要文字和默认底面。ENTER 控件最小高度 48px，内边距 9px 20px，采用像素切角。

### Archive selector

档案入口为最小高度 57px 的横向条目，中文名称与右侧像素英文标签并排。选中、悬停和键盘焦点均使用 Jade 3 底面与 Mint 8 边框；选中标记与英文变为 Mint。保留方向键和回车操作。

### Cards / Containers

策划、Demo 和资料卡使用 Sage 2 底面、细描边和直角。策划主卡内边距 20px，Demo 正文 25px，资料栏 28px。文档封面使用 Jade / Mint / Sage 深色区分现有卡片。卡片悬停与焦点进入时边框转为 Mint 7，底面转为 Sage 3，并出现交互阴影。文档封面细微倾斜由指针控制，最大旋转参数在脚本中限定。

### Navigation

桌面导航为 14px 正文，默认次要文字，悬停与当前项使用 Mint，当前项下方为 3px 线。移动端保留全部导航。FX 控件有 44px 最小高度，方形状态灯表示当前开关状态。

### Quiet garden and pixel field

庭院图片仅位于首页局部面板，使用 pixelated 渲染；现有地图入口有像素标记和清晰文字标签。全屏背景采用透明 WebGL shader：稀疏像素、右侧抖动轨道、鼠标邻近增亮与点击涟漪。没有 WebGL 时使用 Canvas 漂浮粒子。800px 以下轨道降低不透明度，粒子与网格配置随屏宽调整。

动效受 FX 本地偏好和系统 reduced-motion 控制，页面进入后台暂停绘制。reduced-motion 关闭动画、过渡、shader、封面倾斜与扫光；FX 关闭时停止背景与粒子，取消页面进入动画、封面倾斜、扫光和 Demo 图标位移，普通按钮的 CSS 状态反馈仍保留。新增动效沿用这一行为。

### Detail dialog and status

详情弹窗使用深色工具条、关闭按钮与可滚动内容区。桌面内容内边距 30px，移动端 24px 20px。Toast 使用抬高底面和 Mint 描边，位于底部中央，淡入伴随 12px 位移。内容未填写时保留具体占位状态和禁用操作。

## Do's and Don'ts

### Do:

- **Do** 沿用 Sage / Jade / Mint 语义变量、细边框与直角内容容器。
- **Do** 将像素字体用于标题、游戏控制与短英文标签，让正文保持清晰。
- **Do** 保持背景低对比、庭院局部展示，并遵循 FX、reduced-motion 与后台暂停行为。
- **Do** 让键盘焦点、当前导航和禁用状态清楚可见。

### Don't:

- **Don't** 将庭院插画铺成全屏背景，或扩大轨道、粒子到影响正文阅读。
- **Don't** 为普通卡片引入圆角、另一套配色或另一套字体。
- **Don't** 用像素字体排长段正文，或让动效成为访问内容的前提。
- **Don't** 添加虚构的项目、成绩、任职经历或可用链接。
