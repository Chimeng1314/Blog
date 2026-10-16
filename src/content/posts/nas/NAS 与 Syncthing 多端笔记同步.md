---
title: "NAS 与 Syncthing 多端笔记同步"
published: 2026-10-16 21:30:00
description: 使用 Syncthing 在 NAS、Mac 与 Windows 之间同步 Typora 笔记和图片，记录 Docker Compose 部署、设备配对、NetsGo 外网转发，以及版本保留、权限和带宽排查。
tags: ["NAS", "Syncthing", "Typora", "Docker", "Docker Compose", "NetsGo", "文件同步"]
category: 运维与系统管理
series: "Docker 入门与实践"
seriesOrder: 21
hubs: ["docker-learning"]
draft: false
lang: zh-CN
---

# 【一】方案目标与工作原理

## 【1】使用场景

使用 Typora 编辑 Markdown，在 Mac、Windows 与 NAS 之间保持笔记和图片同步。每台电脑保留完整本地副本，离线也能编辑；联网且 Syncthing 运行后继续同步。

![多端笔记同步架构](https://oss.silentdream.top/2026/10/16/22-05-13-dcd91da9-01-architecture-f7710f.png)

本文按原始部署记录整理，文中的实测数值与完成状态仅代表该案例；通用配置说明对照 2026-10-16 查阅的官方资料，后续版本请再次核对文末链接。

本文使用占位符，不保存真实公网地址、设备 ID、账号、域名、API Key 或客户端密钥。示例目录 `/volume1/StudyNote` 是笔记存储位置；复制命令前应替换所有尖括号占位符。

| 占位符 | 含义 |
| --- | --- |
| `<NAS_LAN_IP>` | NAS 局域网 IP |
| `<CLOUD_IP>` | NetsGo 服务端公网 IP |
| `<NAS_USER>` | NAS 登录账号 |
| `<MAC_USER>` | Mac 本地账号目录名 |
| `<NAS_DEVICE_ID>` | NAS 的 Syncthing 设备 ID |
| `<MAC_DEVICE_ID>` / `<WINDOWS_DEVICE_ID>` | 两台电脑各自的设备 ID |

## 【2】三个软件分别负责什么

| 组件 | 职责 | 不负责的事情 |
| --- | --- | --- |
| Typora | 编辑本地 Markdown，显示图片 | 不负责跨设备同步 |
| Syncthing | 比较文件变化，传输缺失数据，维护各端副本 | 不提供多人实时协同编辑 |
| NetsGo | 在无法直接访问 NAS 时转发 TCP 连接 | 不理解笔记内容，不做版本合并 |

NAS 是长期在线的同步节点，不是 Syncthing 必须依赖的中心服务器。即使两台电脑不同时在线，也可先后通过 NAS 交换变更。电脑之间只有互相配对、共享文件夹并建立连接后，才会直接交换文件。

## 【3】一次文件同步如何发生

![文件同步流程](https://oss.silentdream.top/2026/10/16/22-05-13-689383c4-02-sync-flow-421629.png)

### （1）发现变化

Typora 保存文件后，Syncthing 通过文件监听或周期扫描发现变化，更新文件索引并计算数据块哈希。

### （2）比较与传输

已经配对的设备交换索引，判断需要更新哪些文件和数据块，通过 TLS 加密连接传输所需内容，接收端校验后更新本地文件。设备 ID 来源于设备证书，供对端识别身份；它不是 IP 地址，也不是登录密码。

设备发现服务帮助找到连接地址，不负责保存笔记。公共中继转发加密流量，不需要读取笔记明文。

### （3）删除、冲突与历史版本

双向同步也会传播删除。离线期间两端修改同一文件，可能产生 `.sync-conflict-...` 冲突副本，应人工比较并合并。Syncthing 不按“最后保存时间”简单覆盖所有冲突。

文件版本保留主要保存被远端同步覆盖或删除的旧文件，不记录本机直接编辑的每次历史。分级保留会逐步稀疏旧版本，最长 90 天不等于保留每次修改 90 天。同步仍需搭配独立备份。

# 【二】NAS 上部署 Syncthing

## 【1】检查环境与目录权限

在 NAS 的 SSH 终端执行：

```bash
docker --version
docker compose version
id
ss -lntu | grep -E ':(18384|22000|22001|21027) '
```

本案例中 NAS 内置同步服务已占用默认的 `22000/21027`，独立实例改用 `22001`。端口冲突应先查明服务来源，不要直接停止系统服务。

在 NAS 文件管理器中创建共享目录 `/volume1/StudyNote`，给运行 Syncthing 的用户授予读取、写入和遍历权限。通过 NAS 的共享文件夹权限界面配置，不建议直接递归 `chmod 777`。

```bash
mkdir -p "$HOME/docker/syncthing/config"
cd "$HOME/docker/syncthing"
# 使用当前账号的 UID/GID；该账号必须能读写笔记目录。
printf 'PUID=%s\nPGID=%s\n' "$(id -u)" "$(id -g)" > .env
```

## 【2】创建 Compose 文件

在上述目录创建 `compose.yaml`：

```yaml
services:
  syncthing:
    # 本案例固定已验证镜像摘要，避免重建时自动升级。
    image: syncthing/syncthing@sha256:4d0281bdcb4ed9baf503d251d0544ddd856f49fce3f114056257ae172b7fb670
    container_name: notes-syncthing
    hostname: nas-notes
    restart: unless-stopped
    environment:
      PUID: "${PUID}"
      PGID: "${PGID}"
      STNODEFAULTFOLDER: "true"
    ports:
      # 管理入口只绑定本机，公网同步不需要暴露管理页面。
      - "127.0.0.1:18384:8384"
      # 宿主机端口与后续 Syncthing 内部监听地址对应。
      - "22001:22001/tcp"
      - "22001:22001/udp"
    volumes:
      - ./config:/var/syncthing
      - /volume1/StudyNote:/notes
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

```bash
docker compose config --quiet
docker compose up -d
docker logs --tail 100 notes-syncthing
```

示例镜像摘要已确认存在，包含 Linux AMD64、ARM64 与 ARMv7 平台。它用于复现原案例，不代表当前最新版本；新部署仍需按 NAS 架构核对官方发布说明。

`./config` 保存设备身份、配置和索引。不要随意删除，否则可能需要重新配对。笔记实际位于 NAS 的 `/volume1/StudyNote`；在容器管理界面里必须填写映射后的 `/notes`。

**注意：映射 22001 不会自动改变 Syncthing 的内部监听端口。下一步必须修改监听地址。**

## 【3】访问管理页面

### （1）SSH 允许端口转发时

在电脑终端执行并保持运行：

```bash
ssh -N -L 18384:127.0.0.1:18384 <NAS_USER>@<NAS_LAN_IP>
```

浏览器打开 `http://127.0.0.1:18384`。若通过公网 SSH 隧道访问，另加该 SSH 服务实际使用的 `-p <端口>`。

### （2）SSH 禁止端口转发时

本案例曾返回 `administratively prohibited`，因此上面的访问方式在现有 SSH 策略下不可用。

可在可信局域网中，把 Compose 管理端口绑定改为 NAS 的实际局域网 IP：

```yaml
- "<NAS_LAN_IP>:18384:8384"
```

执行 `docker compose up -d` 后，在局域网访问 `http://<NAS_LAN_IP>:18384`。首次进入后，在“操作 → 设置 → GUI”设置管理用户名、密码，建议启用 HTTPS；启用后改用 `https://`。不要将 18384 添加到公网 NetsGo 隧道。若使用自签名证书，应核对访问目标。

这是可选管理方式，原案例实际部署仍绑定 `127.0.0.1`，并通过 NAS 本机 REST API 完成配置；尚未实施局域网 GUI 暴露或修改 SSH 策略。

后文按 GUI 操作说明配置项，需先通过上述任一可用方式进入管理页面。若继续采用原案例的 REST API 方式，应在 NAS 本机按[官方 REST API 文档](https://docs.syncthing.net/dev/rest.html)操作，并使用本实例的 API Key；本文不提供或记录实际密钥。

## 【4】修改监听地址与新建笔记文件夹

### （1）连接设置

进入“操作 → 设置 → 连接”，将同步协议监听地址设为以下地址列表（界面通常使用逗号分隔）：

```text
tcp://0.0.0.0:22001, quic://0.0.0.0:22001, dynamic+https://relays.syncthing.net/endpoint
```

本案例关闭“本地发现”，避免与 NAS 内置同步服务混用广播发现；保留全球发现和中继。关闭本地发现不影响手动填写局域网地址。保存后按界面提示重启。

### （2）添加文件夹

在 NAS 管理页面点击“添加文件夹”：

| 字段 | 设置 |
| --- | --- |
| 文件夹标签 | StudyNote |
| 文件夹 ID | study-note |
| 文件夹路径 | /notes |
| 文件夹类型 | 发送与接收 |
| 文件版本控制 | 分级版本控制 / Staggered |
| 最大保留时间 | 90 天 |

标签用于显示；文件夹 ID 用于跨设备匹配，必须一致；各设备本地路径可以不同。版本控制也需逐台设备配置，不会随文件夹共享自动启用。GUI 中的最大保留时间按天填写；若通过 REST API 配置，`versioning.params.maxAge` 使用秒，90 天为 `7776000` 秒。

### （3）扫描与忽略规则

正常情况下优先使用文件监听。本案例遇到目录监听权限错误后，关闭“监视更改”，将完整重新扫描间隔设为 **30 秒**。这使 NAS 本机变化通过周期扫描被发现，但不保证在 30 秒内完成扫描或同步；大目录扫描开销更高，可适当延长间隔。若完整扫描也提示权限错误，必须修复目录权限，不能靠关掉监听解决。

在“文件夹 → 编辑 → 忽略模式”填写：

```text
/#recycle
(?d).DS_Store
(?d)Thumbs.db
(?d)desktop.ini
```

`/#recycle` 排除 NAS 根层回收站；`(?d)` 标记可在删除父目录时清理的忽略文件。规则只在本设备生效，不会自动配置其他电脑。

# 【三】添加 Mac 和 Windows 客户端

## 【1】安装与获取设备 ID

从 [Syncthing 官网](https://syncthing.net/downloads/)安装对应系统版本，启动后打开客户端管理页面，通常是 `http://127.0.0.1:8384`。

分别在 NAS、Mac、Windows 的“操作 → 显示 ID”中获取设备 ID。不要把文件夹 ID `study-note` 当成设备 ID。

![客户端配对与共享流程](https://oss.silentdream.top/2026/10/16/22-05-13-0c0984d2-04-pairing-959736.png)

## 【2】在 NAS 添加客户端 ID

### （1）添加 Mac

1. 在 NAS 页面点击“添加远程设备”。
2. 设备 ID 填 `<MAC_DEVICE_ID>`，名称填 `Mac`。
3. 地址保留 `dynamic`，不要启用自动接受所有文件夹。
4. 保存后，展开 `StudyNote`，点击“编辑 → 共享”，勾选 `Mac` 并保存。

### （2）添加 Windows

重复上述步骤，设备 ID 换为 `<WINDOWS_DEVICE_ID>`，名称填 `Windows`；在 `StudyNote` 的共享列表中同时保留 Mac 和 Windows。

**添加设备只建立信任关系，不代表已经共享文件夹。必须同时完成“设备配对”和“文件夹共享”。**

## 【3】在电脑接受 NAS 与文件夹

1. 在电脑 Syncthing 接受 NAS 的设备邀请，核对 `<NAS_DEVICE_ID>`；没有提示时手动添加 NAS ID。
2. 接受 NAS 发来的 `StudyNote` 文件夹邀请。
3. 确认文件夹 ID 为 `study-note`，选择电脑上的本地目录。
4. 类型选择“发送与接收”，保存并等待完成。

| 设备 | 示例路径 |
| --- | --- |
| Mac | `/Users/<MAC_USER>/Documents/StudyNote` |
| Windows | `D:\StudyNote` |
| NAS | `/volume1/StudyNote`，容器内为 `/notes` |

已有笔记可选择原有目录，但首次合并前先备份；双向同步会合并文件集并传播后续删除。不要将 NAS 的 `/notes` 路径照搬到电脑。

## 【4】Typora 使用与验证

Typora 打开电脑本地笔记目录。图片统一放在笔记目录内，例如 `assets/`，使用相对链接：

```markdown
![示意图](assets/example.png)
```

等待显示“最新”后，用临时小文件验证 Mac → NAS → Windows，再从 Windows 修改并验证返回 Mac。确认内容一致后删除临时文件，并确认各端同步删除。不要用有价值的笔记做删除测试。

设置客户端随登录启动，并留意电脑休眠会暂停同步。切换设备编辑前先等待同步完成。

# 【四】外网连接与 NetsGo 转发

## 【1】三种传输路径

![局域网、自有转发与公共中继](https://oss.silentdream.top/2026/10/16/22-05-13-8e03a80c-03-network-bff80b.png)

| 路径 | 使用条件 | 主要限制 |
| --- | --- | --- |
| 局域网直连 | 电脑可访问 NAS 局域网 IP | 本地网络、硬盘性能 |
| 自有 NetsGo 转发 | 已建立隧道并放行云端端口 | 云服务器带宽、家庭上行 |
| 公共中继 | 无法建立其他可用连接 | 中继负载及网络路径 |

Syncthing 会尝试可用地址，保留 `dynamic` 可提供发现及中继回退。经 NetsGo 建立后可能显示 `tcp-client`，这表示 Syncthing 使用 TCP，不代表绕过了云服务器。

## 【2】创建 NetsGo 隧道

本节假定已按 [NetsGo 官方文档](https://netsgo.zs.uy)部署服务端、接入 NAS 客户端，并确认客户端在线；这里只说明笔记同步所需的 TCP 隧道。

| 字段 | 设置 |
| --- | --- |
| 客户端 | NAS 上的 NetsGo 客户端 |
| 协议 | TCP |
| 云服务器入口 | 0.0.0.0:22001 |
| NAS 目标 | 127.0.0.1:22001 |

目标为 `127.0.0.1` 的前提是 NetsGo 客户端可访问 NAS 宿主机网络。本案例采用 host 网络；若客户端采用 bridge 网络，容器的 `127.0.0.1` 指向容器自身，需要换成可达的 NAS 地址。

同时放行云安全组入方向 TCP 22001 和主机防火墙。使用 UFW 的服务器可执行：

```bash
sudo ufw allow 22001/tcp comment 'Syncthing'
sudo ufw status
ss -lnt | grep ':22001 '
```

这里只建 TCP 隧道，无需为了这条隧道额外放行云端 UDP。NAS 上的 UDP 映射是给可直接使用 QUIC 的路径准备的。

## 【3】修改电脑端 NAS 地址

在 Mac、Windows 分别打开“NAS 远程设备 → 编辑 → 高级 → 地址”：

```text
tcp://<CLOUD_IP>:22001, dynamic
```

同一局域网内可增加：

```text
tcp://<NAS_LAN_IP>:22001
```

只创建 NetsGo 隧道不会自动修改 Syncthing 地址。添加地址后观察实际连接，必要时短暂暂停并恢复 NAS 设备以触发重连。

# 【五】故障排查与速度分析

## 【1】按层检查连接

### （1）云端端口是否可达

Mac：

```bash
nc -vz -G 5 <CLOUD_IP> 22001
```

Windows PowerShell：

```powershell
Test-NetConnection -ComputerName <CLOUD_IP> -Port 22001
```

超时可能涉及安全组、防火墙或路由；拒绝连接通常涉及没有监听或主动拒绝。不能仅凭一种报错确定根因。

### （2）隧道是否真的传输

NetsGo 显示“已建立”只说明隧道已注册，不保证外部能访问。检查流量是否增长，并展开 Syncthing 远程设备确认实际地址及连接类型：`relay-*` 为中继，指向云服务器 22001 的 `tcp-client` 才是本方案的自有转发路径。

### （3）文件是否正常同步

检查文件夹状态、未同步项目及日志。端口可达不等于证书身份配对正确；设备已连接不等于文件夹已经共享。

## 【2】本案例的最终排查结果

最初 Mac 仅配置 `dynamic`，实际经公共中继传输，下载约 36–49 KiB/s。随后新增 NetsGo TCP 隧道、添加电脑端地址并放行端口，最终确认 Mac 使用自有转发路径。

一次 15 秒业务采样下载约 **102.5 KiB/s**、上传约 **233.8 KiB/s**，无同步错误。这是当时业务流量，不是独立压力测试。

云服务器带宽为 **3 Mbps**：

```text
3,000,000 bit/s ÷ 8 = 375,000 byte/s ≈ 366 KiB/s
102.5 + 233.8 = 336.3 KiB/s
```

Mac 的上传和下载在云端转发时，均会消耗服务器公网出方向带宽，因此共享该出口额度。采样合计接近理论上限，说明云出口很可能是主要瓶颈；其他业务、协议开销、小文件数量和家庭上行也会影响速度。

日常纯文本增量通常很小，可先观察首次同步后的体验。大量图片或附件可考虑提高云带宽；局域网同步可绕过云出口。升级云带宽属于付费操作，本案例没有执行。

## 【3】NetsGo TLS 指纹错误

若 NAS 客户端日志出现 `TLS certificate fingerprint mismatch`，会导致客户端离线、下属隧道不可用。

先在可信服务端核实当前证书，再修改 NAS 客户端配置中的 `NETSGO_TLS_FINGERPRINT`，然后在对应 Compose 目录执行 `docker compose up -d`。不要直接抄日志中的新指纹，也不要关闭验证。

修改 Compose 环境变量后，单纯 `docker restart` 不会加载新值。公网服务器的 SSH 22 端口与转发到 NAS 的 SSH 入口是不同服务；出现密码提示也不能证明账号有效。

# 【六】维护与完成状态

## 【1】常用维护命令

在 NAS 执行：

```bash
cd "$HOME/docker/syncthing"
docker compose config --quiet
docker compose up -d
docker ps --filter name=notes-syncthing
docker logs --tail 100 notes-syncthing
```

升级前备份 Compose、配置目录和笔记，尤其要保留设备身份文件。定期检查历史版本占用空间，并配置独立备份或快照。

## 【2】本案例已完成与待验证事项

| 项目 | 状态 |
| --- | --- |
| NAS 独立容器、目录映射、日志轮转 | 已完成 |
| NAS 双向同步、90 天分级版本、30 秒扫描 | 已完成 |
| Mac 配对与实际传输 | 已验证 |
| Windows 设备添加和 NAS 端共享 | 已完成；电脑端最终同步完成情况待确认 |
| NetsGo TCP 22001 隧道与 Mac 实际连接 | 已验证 |
| 局域网 GUI 或 SSH 转发管理方式 | 本案例未启用；原管理端口仍仅绑定 NAS 本机 |
| 独立备份、快照任务 | 未配置 |
| 云服务器带宽升级 | 未执行 |

本文配图均为不含真实身份信息的结构示意图，已上传图床；前文 `assets/example.png` 仅演示笔记库中的相对图片路径。运行配置、API Key、密码和实际设备 ID 不应复制进可分享笔记。之前截图暴露的客户端密钥需单独轮换，编辑本文不会撤销已经泄露的凭证。


# 【七】官方参考资料

- [Syncthing 下载与客户端选择](https://syncthing.net/downloads/)
- [Syncthing 官方 Docker 镜像部署说明](https://github.com/syncthing/syncthing/blob/main/README-Docker.md)
- [Syncthing 同步原理与冲突处理](https://docs.syncthing.net/users/syncing.html)
- [Syncthing 文件版本控制](https://docs.syncthing.net/users/versioning.html)
- [Syncthing 忽略规则](https://docs.syncthing.net/users/ignoring.html)
- [Syncthing 防火墙与端口配置](https://docs.syncthing.net/users/firewall.html)
- [Syncthing REST API](https://docs.syncthing.net/dev/rest.html)
- [NetsGo 项目与中文说明](https://github.com/zsio/netsgo/blob/main/README.zh-CN.md)
- [NetsGo 官方文档](https://netsgo.zs.uy)
