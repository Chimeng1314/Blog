---
title: "Firefly 博客接入 Waline 评论系统"
published: 2026-09-20 10:30:00
description: 对比 Firefly 内置评论方案，记录使用 Vercel 与 Neon 部署 Waline、绑定域名、注册管理员及接入博客的完整流程。
image: https://oss.silentdream.top/2026/09/30/17-42-22-6535a9c1-1783874253817_image-08aeb9.jpeg
tags: ["Astro", "Firefly", "Waline", "评论系统", "Vercel", "Neon"]
category: Web 开发
series: "Firefly 博客搭建与实践"
seriesOrder: 1
hubs: ["firefly-features"]
draft: false
lang: zh-CN
---

静态博客可以没有评论，但有了评论区，读者能直接反馈、交流，文章也更有「活气」。

我的博客基于 [Firefly](https://github.com/CuteLeaf/Firefly)（Astro 主题），官方内置了多种评论方案。折腾了一圈，我最终选了 **Waline**——自带后端、支持匿名和登录、还能顺带做浏览量统计，和 Firefly 的配置方式也很契合。

本文分三块：

1. **评论方案怎么选**（五种评论系统 + 关闭选项）
2. **Waline 服务端部署**（Vercel + Neon，跟官方教程走）
3. **Firefly 客户端接入**（改 `commentConfig.ts` 即可）

官方文档我会贴在文中，方便你直接点进去对照。

# 【一】Firefly 评论系统一览

Firefly 通过 `src/config/commentConfig.ts` 统一管理评论，`type` 设为对应名称即可启用，设为 `"none"` 则关闭评论。

详细字段说明见 Firefly 官方文档：[评论系统 | Firefly Docs](https://docs-firefly.cuteleaf.cn/zh/guide/comment.html)

## 【1】评论方案对比

| 评论系统   | 类型       | 是否需要自建后端  | 数据存储           | 登录方式          | 浏览量统计 | 部署难度 | 适合场景                                   |
| :--------- | :--------- | :---------------- | :----------------- | :---------------- | :--------- | :------- | :----------------------------------------- |
| **Twikoo** | 带后端     | 需要（云函数等）  | 云数据库           | 匿名 + 登录       | ✅ 支持     | 中等     | 国内用户多、想要简洁 UI 的个人博客         |
| **Waline** | 带后端     | 需要（Vercel 等） | PostgreSQL 等      | 匿名 + 账号 / OAuth 登录 | ✅ 支持 | 中等 | 需要评论管理后台、表情丰富、从 Valine 迁移 |
| **Artalk** | 自托管     | 需要（自建服务）  | 自管数据库         | 可配置            | ✅ 支持     | 较高     | 完全掌控数据、有服务器资源                 |
| **Giscus** | 无后端     | 不需要            | GitHub Discussions | GitHub 账号       | ❌ 不支持   | 低       | 开源项目、读者多为开发者                   |
| **Disqus** | 第三方托管 | 不需要            | Disqus 平台        | Disqus 账号       | ❌ 不支持   | 低       | 老牌方案，但国内体验一般                   |
| **none**   | —          | —                 | —                  | —                 | —          | —        | 暂时关闭评论                               |

## 【2】我选 Waline 的原因

- **有管理后台**：`/ui` 里可以审核、删除、标记评论
- **部署成本可控**：Vercel + Neon 免费额度够个人博客用
- **Firefly 原生支持**：改配置就行，不用自己写 `init()` 和样式引入
- **表情 + 匿名**：`login: "enable"` 时访客可直接留言，也可以注册账号

如果你仓库就在 GitHub、读者也习惯用 GitHub 登录，**Giscus** 会更省事；如果不想自己维护服务器，可以考虑用云函数部署 **Twikoo**，但它仍然需要后端服务。

# 【二】部署 Waline 服务端

Waline 是 **前后端分离** 的：先要有一个跑起来的 **serverURL**，博客前端才能连上。

我按 [Waline 快速上手](https://waline.js.org/guide/get-started/) 官方文档，用 **Vercel 部署服务 + Neon 数据库**。整体和部署 Umami 类似，也是 Vercel + Neon 组合。

> 官方文档里还有视频教程章节，附了 B 站 UP 主的演示，文末我也嵌了自己的参考视频。

## 【1】在 Vercel 部署 Waline 服务

1. 点击 Waline 官方一键部署：[Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/walinejs/waline/tree/main/example)（与 [Waline 快速上手](https://waline.js.org/guide/get-started/) 文档页顶部相同）

2. 未登录则用 **GitHub** 快捷登录 Vercel

3. 输入项目名称，点击 **Create**
   ![在 Vercel 创建 Waline 项目](https://oss.silentdream.top/2026/09/30/17-42-22-7dccdaa2-image-20260930102903239-c02af6.png)

4. Vercel 会基于 Waline 模板帮你创建并初始化 GitHub 仓库
   ![Vercel 初始化 Waline 仓库](https://oss.silentdream.top/2026/09/30/17-42-22-2be07e0b-image-20260930102944986-b2c38d.png)

5. 一两分钟后部署成功，点击 **Go to Dashboard** 进入控制台

   ![Waline 部署成功后的项目控制台](https://oss.silentdream.top/2026/09/30/17-42-22-adc9781e-image-20260930103021332-09f9cd.png)

## 【2】创建 Neon 数据库

Waline v3 推荐使用 PostgreSQL，[官方教程](https://waline.js.org/guide/get-started/#%E5%88%9B%E5%BB%BA%E6%95%B0%E6%8D%AE%E5%BA%93) 走 Vercel Marketplace 里的 **Neon**：

1. Vercel 项目顶部 **Storage** → **Create Database**

2. **Marketplace Database Providers** 选择 **Neon** → **Continue**

3. 首次使用需 **Accept and Create** 创建 Neon 账号；套餐和地区可默认，一路 **Continue**

   ![在 Vercel Marketplace 创建 Neon 数据库](https://oss.silentdream.top/2026/09/30/17-42-22-9a6cbb64-image-20260930103141955-99d6fe.png)

4. 数据库名称可默认，继续 **Continue**

5. Storage 列表里进入刚创建的数据库 → **Open in Neon**

   ![从 Vercel Storage 打开 Neon 数据库](https://oss.silentdream.top/2026/09/30/17-42-22-622c7d65-image-20260930103329185-e138a2.png)

6. Neon 左侧 **SQL Editor**，把 Waline 仓库里 [waline.pgsql](https://github.com/walinejs/waline/blob/main/assets/waline.pgsql) 的 SQL **完整粘贴**进去，点击 **Run** 建表

   ![在 Neon SQL Editor 执行 Waline 建表脚本](https://oss.silentdream.top/2026/09/30/17-42-22-5fa9ce6b-image-20260930103717875-29ab43.png)

## 【3】重新部署使数据库生效

1. 回到 Vercel → **Deployments**

2. 最新一次部署右侧 **⋯** → **Redeploy**

   ![重新部署 Waline 使数据库配置生效](https://oss.silentdream.top/2026/09/30/17-42-22-ca20cab9-image-20260930103853634-e11f68.png)

3. 等待 **STATUS** 变为 **Ready**

4. 点击 **Visit**，打开的地址就是你的 **serverURL**（形如 `https://xxx.vercel.app`）

# 【三】绑定自定义域名（可选）

希望用 `comment.xxx.com` 这类域名时：

1. Vercel **Settings** → **Domains** → 输入域名 → **Add**
2. 在域名 DNS 添加 CNAME：

| Type  | Name                  | Value                                        |
| :---- | :-------------------- | :------------------------------------------- |
| CNAME | `comment`（示例子域） | `cname.vercel-dns.com`（以 Vercel 提示为准） |

生效后：

- 评论 API：`https://comment.yourdomain.com`
- 管理后台：`https://comment.yourdomain.com/ui`

我绑定的是 `blogcomment.silentdream.top`。

# 【四】注册管理员

部署完成后访问：

```text
<serverURL>/ui/register
```

**第一个注册的账号会自动成为管理员**。之后管理员登录 `/ui` 即可管理评论；普通用户也可以在评论框注册，登录后进入个人档案页。

更多细节见官方：[评论管理（管理端）](https://waline.js.org/guide/get-started/#评论管理-管理端)

![注册 Waline 管理员账号](https://oss.silentdream.top/2026/09/30/17-42-22-1f2dfa0e-image-20260930114412942-34a24a.png)

# 【补充】视频教程（B 站）

官方文档里也推荐了 UP 主视频；下面这条是我跟着做时的参考，标题：**6202年！如何部署一个 Waline 评论系统？**

[6202年！如何部署一个 Waline 评论系统？](https://www.bilibili.com/video/BV1J2XuBtEGn/)

Waline 官方视频教程合集：[快速上手 - 视频教程](https://waline.js.org/guide/get-started/#视频教程)

# 【五】Firefly 接入评论系统

服务端跑起来之后，Firefly **不需要** 自己写 Waline 文档里的 `<link>` 和 `init()`——主题已经封装好了，只改配置即可。

## 【1】修改 `commentConfig.ts`

文件路径：`src/config/commentConfig.ts`

```typescript
import type { CommentConfig } from "../types/commentConfig";

export const commentConfig: CommentConfig = {
	// 评论系统类型: none, twikoo, waline, giscus, disqus, artalk，默认为none，即不启用评论系统
	type: "waline",

	//waline评论系统配置
	waline: {
		// waline 后端服务地址
		serverURL: "https://blogcomment.silentdream.top",
		// 设置 Waline 评论系统语言
		lang: "zh-CN",
		// 设置 Waline 评论系统表情地址
		emoji: [
			"https://unpkg.com/@waline/emojis@1.4.0/weibo",
			"https://unpkg.com/@waline/emojis@1.4.0/bilibili",
			"https://unpkg.com/@waline/emojis@1.4.0/bmoji",
		],
		// 评论登录模式。可选值如下：
		//   'enable'   —— 默认，允许访客匿名评论，也允许账号登录评论。
		//   'force'    —— 强制必须登录后才能评论，适合严格社区，关闭匿名评论。
		//   'disable'  —— 隐藏登录入口，仅允许匿名评论（填写昵称/邮箱）。
		login: "enable",
		// 是否启用文章访问量统计功能
		visitorCount: true,
	},
};
```

## 【2】配置项说明

| 属性                  | 类型       | 默认值     | 说明                                                         |
| :-------------------- | :--------- | :--------- | :----------------------------------------------------------- |
| `waline.serverURL`    | `string`   | -          | Waline 后端服务地址                                          |
| `waline.lang`         | `string`   | `"zh-CN"`  | 语言设置                                                     |
| `waline.emoji`        | `string[]` | -          | 自定义表情包地址列表                                         |
| `waline.login`        | `string`   | `"enable"` | 登录模式：`"enable"` 允许匿名和登录、`"force"` 强制登录、`"disable"` 仅匿名 |
| `waline.visitorCount` | `boolean`  | `true`     | 是否启用文章访问量统计                                       |

完整字段表见：[Firefly Docs - Waline](https://docs-firefly.cuteleaf.cn/zh/guide/comment.html#waline)

`login` 控制客户端是否显示或要求登录。第三方 OAuth 登录依赖授权服务，Waline 默认使用 `https://oauth.lithub.cc`，也可以通过服务端的 `OAUTH_URL` 使用自建服务。如果希望服务端也强制登录后才能评论，需要设置 `LOGIN=force`。详见 [Waline 服务端环境变量](https://waline.js.org/reference/server/env.html)。

## 【3】本地验证

1. 在项目根目录运行：

   ```bash
   pnpm dev
   ```

2. 打开任意文章页，滚动到文末应出现 Waline 评论框。若空白：

- 浏览器 **F12 → Network** 看请求是否打到 `serverURL`

- 确认 `<serverURL>/ui` 能打开，评论 API 请求有正常响应

- 确认 Vercel 部署 **Ready**、Neon 表已创建

![Firefly 文章页显示 Waline 评论框](https://oss.silentdream.top/2026/09/30/17-42-22-4a329287-image-20260930120123776-cc3a50.png)

## 【4】构建并部署博客

改完配置后把站点部署到 Cloudflare Pages / Vercel 等静态托管即可。

```bash
pnpm check
pnpm type-check
pnpm build
```

评论请求走 Waline 服务端，不依赖博客托管平台。

# 【六】常见问题

| 问题           | 处理                                                         |
| :------------- | :----------------------------------------------------------- |
| 评论框空白     | 检查 `serverURL`、Vercel 是否 Ready、Neon 是否执行了 `waline.pgsql` |
| 能看不能发     | 看 Waline `/ui` 后台是否禁言；`login` 模式是否设为 `force` 但未登录 |
| 浏览量不更新   | 确认 `visitorCount: true`，且 Waline 服务端版本支持统计      |
| 域名 CORS 报错 | 检查服务端 `SECURE_DOMAINS` 是否允许博客域名，并确认请求地址和协议正确（见 [Waline 服务端环境变量](https://waline.js.org/reference/server/env.html)） |
| 表情加载慢     | 换国内 CDN 或精简 `emoji` 列表                               |

------

# 【七】参考链接

| 文档                        | 链接                                                         |
| :-------------------------- | :----------------------------------------------------------- |
| Firefly 评论系统配置        | [docs-firefly.cuteleaf.cn/zh/guide/comment.html](https://docs-firefly.cuteleaf.cn/zh/guide/comment.html) |
| Waline 快速上手             | [waline.js.org/guide/get-started](https://waline.js.org/guide/get-started/) |
| Waline 服务端环境变量       | [waline.js.org/reference/server/env.html](https://waline.js.org/reference/server/env.html) |
| Waline 视频教程（官方收录） | [waline.js.org - 视频教程](https://waline.js.org/guide/get-started/#视频教程) |
| B 站：部署 Waline 评论系统  | [BV1J2XuBtEGn](https://www.bilibili.com/video/BV1J2XuBtEGn/) |

------

总结一遍路径：**Vercel 部署 Waline → Neon 建表 → Redeploy → 注册管理员 → Firefly `commentConfig.ts` 填 `serverURL`**。服务端和博客分开托管，以后换主题或换托管商，评论数据都在 Waline 那边，不用跟着迁。

有新评论想推送到 QQ？见 [Waline 评论 QQ 通知：Qmsg 酱接入指南](https://blog.huchao.vip/posts/astro/waline-qq-notify/)。邮件通知见 [Waline 评论 QQ 邮箱邮件通知配置指南](https://blog.huchao.vip/posts/astro/waline-email-qq-notify/)。

如果你也在用 Firefly，评论区聊聊你选的哪套评论系统。
