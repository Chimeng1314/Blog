---
title: "Firefly 接入我的设备页面"
published: 2026-10-02 14:00:00
description: 为 Firefly 增加独立的“我的设备”页面，支持分类筛选、设备卡片、本地图片和可选官网链接，并整理日常维护方式。
tags: ["Astro", "Firefly", "设备页", "本地图片"]
category: Web 开发
series: "Firefly 博客搭建与实践"
seriesOrder: 3
hubs: ["firefly-features"]
draft: true
lang: zh-CN
---

# 【一】目标

为 Firefly 增加独立的 `/devices/` 页面，用设备卡片记录电脑、手机、服务器和外设。

页面提供分类筛选；每张卡片可展示本地图片、型号/规格、说明和可选官网链接。设备资料集中在一个数据文件维护，页面本身不需要反复修改。

# 【二】实现结构

| 文件 | 作用 |
| --- | --- |
| `src/data/devices.ts` | 日常维护的设备数据 |
| `src/types/devices.ts` | 设备与分类类型 |
| `src/components/features/devices/DeviceCard.astro` | 单张设备卡片 |
| `src/pages/devices.astro` | `/devices/` 页面与分类交互 |
| `src/styles/pages/devices.css` | 卡片、筛选和移动端样式 |
| `public/assets/images/devices/` | 设备本地图片 |

# 【三】设备数据

日常只需要编辑 `src/data/devices.ts`。分类名称会自动成为筛选项；新增、删除分类或设备不需要改页面组件。

### （1）添加类型声明

- 在 `src\types` 添加 `devices.ts`

```ts
export type Device = {
	name: string;
	image?: string;
	icon?: string;
	specs?: string;
	description?: string;
	link?: string;
};

export type DeviceCategory = {
	name: string;
	icon: string;
	devices: Device[];
};
```

### （2）添加设备数据

- 在 `src\data` 添加 `devices.ts`

```ts
export const devicesData: DeviceCategory[] = [
	{
		name: "计算设备",
		icon: "material-symbols:laptop-mac",
		devices: [
			{
				name: "开发主机（待补充）",
				image: "/assets/images/devices/sample-laptop.svg",
				specs: "请填写型号 / 内存 / 存储",
				description: "用于日常开发、写作和本地调试。",
			},
		],
	},
];
```

图片放在 `public/assets/images/devices/` 中，数据里始终使用以 `/assets/` 开头的路径。这样发布后的图片由本站直接提供，不依赖图床或第三方防盗链策略。

没有准备图片时可省略 `image`，卡片会退回显示 `icon` 指定的 Material Symbols 图标。

## 【3】设备状态

设备状态限制为以下五种，列表页与详情页都会显示状态徽标：

```ts
export type DeviceStatus =
	| "在用"
	| "弃用"
	| "已售"
	| "在售"
	| "个人出售";
```

每台设备必须填写 `status`，例如：

```ts
{
	name: "我的台式机",
	status: "在用",
}
```

配置、设备和配件都可加 `linkable: false` 禁用跳转。未填写 `url` 时也会自动显示为普通文本，不展示外链图标：

```ts
{ label: "核心数量", value: "5核6线程", linkable: false }
```

# 【四】设备页面与卡片

## 【1】添加设备卡片

- 在 `src\components\features\devices` 添加 `DeviceCard.astro`

```astro
---
import { Icon } from "astro-icon/components";
import type { Device } from "@/types/devices";
const { device } = Astro.props as { device: Device };
---

<article class="device-card card-base">
	<div class="device-card-media">
		{device.image ? <img src={device.image} alt={device.name} loading="lazy" /> : <div class="device-card-placeholder"><Icon name={device.icon || "material-symbols:devices-other"} /></div>}
	</div>
	<div class="device-card-body">
		<h3>{device.name}</h3>
		{device.specs && <p class="device-card-specs">{device.specs}</p>}
		{device.description && <p class="device-card-description">{device.description}</p>}
	</div>
</article>
```

## 【2】添加设备页面

- 在 `src\pages` 添加 `devices.astro`

页面导入 `devicesData` 和 `DeviceCard`，使用 `MainGridLayout` 渲染标题、分类 Tab 与分类卡片网格；页面开头用 `siteConfig.pages.devices` 控制 404。客户端 `device-filter` Custom Element 负责切换 `[data-group]` 的 `hidden` 属性，并同步“当前显示 N 台设备”。完整源码以当前本地文件为准：`src/pages/devices.astro`。

## 【3】添加页面样式

- 在 `src\styles\pages` 添加 `devices.css`

设备卡片必须使用纵向布局，图片区固定为 `16 / 9`；不能写成横向 `flex`，否则窄内容区会把正文挤成竖排：

```css
.device-card {
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.device-card-media {
	aspect-ratio: 16 / 9;
}
```

产品图片使用 `object-fit: contain` 并保留内边距，保证横图、竖图和不同尺寸的实拍图完整显示；不要使用 `cover`，否则设备主体会被裁切。

# 【五】页面交互

## 【1】设备详情页与可跳转链接

- 在 `src\pages\devices` 添加 `[slug].astro`，由 `getStaticPaths()` 根据 `devicesData` 生成 `/devices/台式机-slug/` 等详情页。
- 设备卡片的“查看详情”链接进入站内详情页；“设备链接”跳转数据中的 `device.url`。
- `DeviceSpecItem` 可选填写 `url`，但 CPU、内存、显卡、硬盘等参数默认只显示文字，不应为了凑链接而填写官网或商品页。
- `DeviceAccessory` 可选填写 `url`；只有确实需要跳转到商品页、官网或说明书时才添加。

```ts
{
	label: "核心数量",
	value: "5核6线程",
	linkable: false,
}
```

```ts
{
	name: "机械键盘",
	model: "待填写型号",
	image: "/assets/images/devices/keyboard.webp",
	url: "https://example.com/products/keyboard",
}
```

## 【2】分类筛选

页面首屏显示“全部”和每个分类的 Tab。点击 Tab 后只显示对应分组，同时更新“当前显示 N 台设备”的提示；交互使用原生 Custom Element，不额外引入客户端框架。

## 【3】设备卡片

- 图片使用懒加载，减少初次打开页面的请求；
- 规格突出使用主题色，说明文字保持次级层级；
- 只有填写 `url` 且未设为 `linkable: false` 时才显示外链图标；
- 移动端筛选项可横向滚动，卡片自动收为单列。

# 【六】本地接入项

本地站点已完成以下接入：

1. 在 `src/types/siteConfig.ts` 的 `pages` 类型增加 `devices: boolean`。
2. 在 `src/config/siteConfig.ts` 增加 `devices: true` 页面开关。
3. 在 `src/config/navBarConfig.ts` 添加“我的设备”导航入口，设置 `pageKey: "devices"`，关闭开关时自动隐藏。
4. 在 `astro.config.mjs` 的 `sitemap.filter` 增加 `pages.devices` 判断，关闭页面时从站点地图移除 `/devices/`。
5. 示例图片保存于本站 `public/assets/images/devices/`，不依赖外部图床。

# 【七】发布前检查

1. 将 `src/data/devices.ts` 中的“待补充”示例替换为实际设备资料。
2. 用实拍图替换 `public/assets/images/devices/` 的示例插画，并同步更新 `image` 路径。
3. 在本机访问 `/devices/`，检查分类筛选、移动端卡片和导航入口。
4. 确认无误后部署站点，并把本文从 `draft` 移入正式文章目录，将 `draft` 改为 `false`。

# 【八】设备记录：酷态科 10 号电能基站

新增“CUKTECH 酷态科 10 号电能基站 - 万象屏”，状态为“在用”。

- 设备官网：[10 号电能基站「万象屏套装」](https://cuktech.com.cn/products/ta1208.html)
- 本地图片：`public/assets/images/devices/CUKTECH-10-main.jpg`

设备顶层“设备链接”跳转官网；参数表中的产品名称、产品定位、接口、功率等均为纯文本展示。

# 【九】维护清单

| 需求 | 修改位置 |
| --- | --- |
| 新增设备或分类 | `src/data/devices.ts` |
| 替换设备图片 | `public/assets/images/devices/` 与数据中的 `image` |
| 调整卡片和移动端布局 | `src/styles/pages/devices.css` |
| 开启或隐藏整页 | `src/config/siteConfig.ts` 的 `pages.devices` |

这样设备内容和展示逻辑保持分离：平时只维护数据与本地图片，页面功能不受影响。

# 【十】设备记录：酷态科 10 号氮化镓充电器 Ultra

在“酷泰科系列”继续添加“CUKTECH 酷态科 10号氮化镓充电器 Ultra”，状态为“在用”。

- 设备官网：[10号氮化镓充电器 Ultra](https://cuktech.com.cn/products/ad1204u.html)
- 本地图片：`public/assets/images/devices/CUKTECH-10-ultra.webp`

详情页参数只记录产品型号、120W 最大总输出、1.57 英寸万象屏和米家/OTA 能力；官网地址只保留为顶部“设备链接”，不会混入参数表或产生多余外链图标。
