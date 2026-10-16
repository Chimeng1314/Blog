---
title: "Nexus Terminal 学习笔记：Web 远程连接与部署运维"
published: 2026-10-16 19:00:00
description: 记录 Nexus Terminal 的 Docker Compose 部署、HTTPS 与 WebSocket 反向代理，以及 SSH、SFTP、RDP、VNC 连接管理，整理登录保护、会话挂起、备份升级和常见排障方法。
tags: ["Nexus Terminal", "Docker", "Docker Compose", "SSH", "SFTP", "RDP", "VNC", "Nginx"]
category: 运维与系统管理
series: "Docker 入门与实践"
seriesOrder: 20
hubs: ["docker-learning"]
draft: false
lang: zh-CN
---

# 【一】先理解它解决什么问题

Nexus Terminal（星枢终端）将远程终端、文件管理和远程桌面集中到浏览器中，适合管理多台服务器。

它本身不是 SSH 服务端，也不会替目标机器开启远程桌面服务。

| 协议 | 主要用途 | 常见目标端口 | 目标机器需要具备的条件 |
| --- | --- | --- | --- |
| SSH | Linux 等主机的命令行管理 | TCP 22 | SSH 服务、有效账号及密码或密钥 |
| SFTP | 文件上传、下载与管理 | 通常复用 SSH 端口 | SSH 服务支持 SFTP 子系统，账号有目录权限 |
| RDP | Windows 等系统的远程桌面 | 通常 TCP 3389 | 系统支持并启用 RDP，账号有远程登录权限 |
| VNC | 远程图形桌面 | 通常 TCP 5900 起 | VNC 服务及相应认证配置 |

端口均可自定义，以目标服务的实际配置为准。**浏览器能打开管理页面，不代表部署服务器能连接目标主机。**

官方列出的主要功能包括：多标签 SSH/SFTP、Monaco 在线文件编辑、RDP/VNC、PWA、自定义主题与布局、简易 Docker 管理面板、人机验证、2FA、IP 访问控制、通知、审计日志和会话心跳保活。

桌面端与 Web 端功能不完全相同：官方说明桌面端移除了 Web 登录验证、会话挂起等功能。

本文按 2026-10-16 查阅的官方 README、Compose 和环境配置整理；`main` 分支与 `latest` 镜像会持续更新，部署时请再次核对文末官方资料。

# 【二】部署架构与网络方向

官方 Compose 包含四个服务：

| 服务 | 职责 | 默认暴露方式 |
| --- | --- | --- |
| `frontend` | Web 入口 | 宿主机 `18111` 映射到容器 `80` |
| `backend` | 业务接口、认证及数据处理 | Docker 内网 `3001` |
| `remote-gateway` | 远程桌面网关 | Docker 内网 API `9090`、WebSocket `8080` |
| `guacd` | Guacamole 远程协议代理 | Docker 内网 `4822` |

可以将访问路径理解为：

- 浏览器访问 Web 入口，入口连接后端和网关；
- 远程桌面由网关配合 `guacd` 连接目标机器。

不要把 Docker 内部地址当作浏览器访问地址。

后端通过 `./data:/app/data` 持久化数据，因此运行 Compose 的项目目录同时也是备份的重要位置。

# 【三】Docker Compose 部署

## 【1】检查前置条件

在计划部署服务的主机上执行：

```bash
docker --version
docker compose version
uname -m
```

需要 Docker Engine 和 Compose 插件。本文使用 `docker compose`；旧版独立命令是 `docker-compose`。

官方建议 Debian AMD64。ARM 用户应额外核对镜像支持：当前 README 建议 ARM64 将 `guacamole/guacd:latest` 改为 `guacamole/guacd:1.6.0-RC1`，这属于当前文档中的特定版本建议，后续应以官方更新为准。ARMv7 另有专用 Compose，官方说明其禁用 RDP。

## 【2】下载部署文件

使用官方预构建镜像时不需要克隆全部源码，只需要 Compose 和环境配置：

```bash
mkdir -p nexus-terminal
cd nexus-terminal

curl -fL https://raw.githubusercontent.com/Heavrnl/nexus-terminal/main/docker-compose.yml -o docker-compose.yml
curl -fL https://raw.githubusercontent.com/Heavrnl/nexus-terminal/main/.env -o .env
```

仅在阅读源码或自行构建时才需要：

```bash
git clone https://github.com/Heavrnl/nexus-terminal.git
cd nexus-terminal
```

以上是两种独立的准备方式，不需要依次执行。

## 【3】核对配置

当前官方 `.env` 的关键配置如下：

```dotenv
DEPLOYMENT_MODE=docker
REMOTE_GATEWAY_API_BASE_LOCAL=http://localhost:9090
REMOTE_GATEWAY_API_BASE_DOCKER=http://remote-gateway:9090
REMOTE_GATEWAY_WS_URL_LOCAL=ws://localhost:8080
REMOTE_GATEWAY_WS_URL_DOCKER=ws://remote-gateway:8080

# 使用 Passkey 时，替换为实际访问域名与来源。
RP_ID="terminal.example.com"
RP_ORIGIN="https://terminal.example.com"
```

- Docker 部署保留 Docker 服务名地址，不要将 `remote-gateway` 随意替换成公网域名。
- `RP_ID` 是域名，不包含协议或路径；`RP_ORIGIN` 是实际访问来源，包含协议，非默认端口也应写入。
- 不使用 Passkey 时，重点核对部署模式及网关地址；启用前再配置实际域名与 HTTPS。
- 当前官方 Compose 启用了 IPv6 网络，并设置 `fd01::/80` 子网。启动前核对 Docker IPv6 支持及子网冲突；如无需 IPv6，可根据实际环境调整网络配置，不能只看容器镜像是否拉取成功。

如果仅通过同机 Nginx 对外提供访问，可将 `frontend.ports` 的原映射替换为：

```yaml
ports:
  - "127.0.0.1:18111:80"
```

这样 `18111` 仅监听本机回环地址。如果 Nginx 也在容器内，其 `127.0.0.1` 指向 Nginx 容器自身，应改用共享网络中的服务名和容器端口。

## 【4】启动与检查

```bash
# 检查配置是否能被 Compose 解析。
docker compose config --quiet

# 拉取镜像并启动。
docker compose pull
docker compose up -d

# 查看容器状态及最近日志。
docker compose ps
docker compose logs --tail=100
```

默认入口为 `http://服务器地址:18111`。若改为回环监听，应通过反向代理访问，或在服务器本机检查：

```bash
curl -I http://127.0.0.1:18111
```

容器显示运行仅代表进程启动，还需要检查页面、登录及实际连接。首次账号初始化方式以当前版本页面提示或官方说明为准，不假定存在通用默认账号和密码。

# 【四】HTTPS 与 WebSocket 反向代理

终端交互依赖长连接，反向代理必须支持 WebSocket。下面是放在已配置域名与 TLS 证书的 Nginx `server` 块中的示例，不是完整 Nginx 配置：

```nginx
location / {
    proxy_pass http://127.0.0.1:18111;
    proxy_http_version 1.1;

    # 将 WebSocket 升级请求传递给上游，支持终端实时交互。
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    # 传递访问域名、协议与客户端地址。
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Range $http_range;
    proxy_set_header If-Range $http_if_range;
    proxy_redirect off;

    # 延长无上游数据时的读取等待时间，具体值可按环境调整。
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
}
```

主机安装的 Nginx 可以这样检查并重载：

```bash
sudo nginx -t
# 仅在配置检查成功后执行。
sudo systemctl reload nginx
```

还应检查域名解析、证书、443 端口，以及额外 CDN/代理层的 WebSocket 支持和超时限制。官方指出，普通非 HTTPS、非 localhost 页面会受到浏览器剪贴板限制，复制功能应通过 HTTPS 使用。

# 【五】登录保护与访问控制

![Nexus Terminal 登录界面](https://oss.silentdream.top/2026/10/16/20-21-58-fbcac369-login-750646.png)

各项机制解决的问题不同：

| 机制 | 主要作用 | 使用要点 |
| --- | --- | --- |
| 人机验证 | 增加自动化登录尝试的成本 | hCaptcha、reCAPTCHA 需配置相应服务，检查网络可达性 |
| 2FA | 在密码之外增加第二道验证 | 使用可靠的验证器，并按系统提供的方式准备恢复手段 |
| IP 白名单/黑名单 | 限制来源地址 | 先确认反向代理后的真实客户端 IP 识别正确 |
| 异常访问自动封禁 | 应对异常尝试 | 排查无法登录时同时检查是否误封 |
| Passkey | 使用设备或认证器完成认证 | 配置正确的 `RP_ID`、`RP_ORIGIN` 和访问域名 |
| 通知、审计 | 发现异常并追踪事件 | 配置后实际触发一次，验证记录与通知是否符合预期 |

日常配置应优先使用当前版本提供的设置界面或部署配置。源码中的中间件路径属于实现细节，不应把修改中间件当成配置 IP 策略的常规步骤。

# 【六】建立连接与管理文件

![Nexus Terminal 工作区中的 SSH 终端、文件管理器与在线编辑器](https://oss.silentdream.top/2026/10/16/20-21-58-2bd50a6d-workspace_light-c5e05a.png)

截图展示的是较早版本的工作区，编辑器中的 `rdp` 服务名和环境变量仅用于界面示意；实际部署请使用上文核对的 `remote-gateway` 配置及最新官方文件。

## 【1】SSH / SFTP

1. 在连接管理界面新建连接，填写目标地址、实际 SSH 端口、用户名及认证信息。
2. 先建立 SSH 连接，确认当前用户、目标主机和工作目录符合预期。
3. 打开文件管理器，检查目录浏览、上传、下载和编辑权限。
4. 按环境或用途命名连接，例如 `测试-应用服务`，便于多标签操作时识别目标。

SFTP 通常复用 SSH 服务，不需要额外开放 FTP 的 21 端口。SSH 能登录但文件管理失败时，重点检查 SFTP 子系统和目录权限。

文件管理器支持拖拽上传、内部拖拽移动、`Ctrl`/`Shift` 多选，以及右键文件操作。大量小文件或深层目录建议先打包再传输，避免浏览器处理过多文件导致卡顿。在线编辑通过 Monaco 提供，修改配置前保留副本，并在保存后执行对应服务的配置检查。

## 【2】RDP / VNC

![Nexus Terminal RDP 连接](https://oss.silentdream.top/2026/10/16/20-21-58-0cc94fb3-RDP-c67509.png)

创建连接时选择协议，再填写目标地址、端口及认证信息；RDP 的域信息按目标环境要求填写。

排查顺序：目标远程服务是否开启 → 账号是否有权限 → 从网关容器到目标的网络是否可达 → `remote-gateway` 和 `guacd` 日志。宿主机可达并不必然代表容器可达。

# 【七】常用操作与会话挂起

| 操作 | 官方 README 中的用法 |
| --- | --- |
| 复制 / 粘贴终端内容 | `Ctrl + Shift + C` / `Ctrl + Shift + V`，可能受浏览器和系统快捷键影响 |
| 切换 SSH 标签 | 命令输入框聚焦时使用 `Alt + ↑/↓` |
| 切换编辑器标签 | 命令输入框聚焦时使用 `Alt + ←/→` |
| 缩放组件 | `Ctrl + 鼠标滚轮` |
| 移动端终端字体缩放 | 双指手势 |
| 调整侧栏宽度 | 拖动展开侧栏 |
| 批量关闭标签 | 标签栏右键菜单 |
| 断线后重连 | 断线状态下按回车，或点击同一 SSH 连接 |
| 挂起 SSH 会话 | SSH 标签页右键选择“挂起会话”，移动端长按 |

挂起会话后，后端接管 SSH 连接，可从面板恢复。**挂起依赖后端继续运行，不能保证后端重启、容器更新或目标机器断网后任务仍然继续。**

对于长时间编译、下载等任务，可在目标机器使用 `tmux`，将任务与当前 SSH 连接分离：

```bash
# 目标主机需先安装 tmux；首次创建会话。
tmux new -s work

# 临时离开：先按 Ctrl+b，再按 d。
# 重新登录后恢复已有会话。
tmux attach -t work
```

`tmux` 可应对 SSH 断开，但不能让任务跨目标机器重启继续运行。命令同步功能会将输入同步到选定目标，使用前应确认目标连接，避免多台机器同时执行了不适合的命令。

# 【八】界面定制与审计

主题、布局及工作区组件优先通过设置界面调整。建议先保留常用终端、文件管理器与命令输入框，再按实际需要增加组件。

当前 README 将双文件管理器标记为实验性功能，并说明同一布局中的多文本编辑器尚未实现；升级后应重新确认这些限制。

审计日志用于追踪用户行为和系统变更，但不能据此推断其完整记录了所有终端命令、输出或桌面画面。实际审计范围、保存期限及可查询字段，应通过当前版本的设置和实际操作验证。

# 【九】备份、升级与回滚

## 【1】备份范围

官方明确建议备份项目目录下的 `data`，并说明项目不提供相关备份功能。还应保存：

- `docker-compose.yml`：镜像、网络、端口及挂载配置。
- `.env`：部署环境与 Passkey 等配置。
- 自己维护的反向代理配置，以及实际使用的镜像版本或摘要。

备份可能包含认证配置或连接数据，应控制读取权限并保存到另一处可靠存储。

## 【2】简单的一致性备份流程

以下命令在 Compose 项目目录执行，会短暂中断服务。先确认 `data` 已存在：

```bash
# 限制新建备份文件的默认权限。
umask 077

# 停止服务，避免备份时仍有数据写入。
docker compose stop

# 将备份写到项目目录之外；如有文件权限错误，需要先处理再继续。
backup_file="../nexus-terminal-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$backup_file" data docker-compose.yml .env

# 归档完成或失败后，都应按实际情况恢复原服务。
docker compose start

# 检查归档可读取且包含预期文件；这不能替代实际恢复验证。
tar -tzf "$backup_file"
```

## 【3】升级

先阅读版本说明并完成备份，再执行：

```bash
docker compose pull
docker compose up -d
docker compose ps
docker compose logs --tail=100
```

`up -d` 会根据镜像和配置变化重建服务，可能中断现有连接。官方 README 的更新流程包含先 `down`；常规镜像更新也可使用上述先拉取再重建的方式，减少提前停机的时间。

官方默认镜像使用 `latest`，它不是固定版本。需要可复现部署时，应记录并使用实际存在的版本标签或镜像摘要，同时保留配套配置。

## 【4】恢复与回滚要点

先停服务并保留当前数据副本，再恢复备份中的数据和配置，核对文件权限，使用与备份兼容的镜像启动。数据库结构可能随版本变化，不能假定只切回旧镜像就能回滚。优先在隔离环境验证恢复流程，避免恢复实例对生产目标执行操作。

# 【十】常见问题排查

| 现象 | 优先排查 |
| --- | --- |
| 页面无法打开 | 容器状态、18111 映射、防火墙、代理上游地址 |
| 页面正常，终端连不上 | WebSocket 升级、目标 SSH 服务、认证及后端到目标的网络 |
| SSH 登录成功，SFTP 失败 | SFTP 子系统、目录权限、账号限制 |
| RDP/VNC 失败或黑屏 | 目标桌面服务、登录权限、网关及 guacd 日志 |
| 连接固定间隔断开 | Nginx/CDN 超时、网络波动、心跳是否正常 |
| 终端不能复制 | 是否使用 HTTPS 或 localhost、浏览器权限、快捷键冲突 |
| 开启 IP 白名单后无法访问 | 实际出口 IP、代理链、真实客户端 IP 识别 |
| Passkey 无法使用 | 访问域名与 RP_ID、RP_ORIGIN 是否一致，是否处于安全上下文 |
| Compose 创建网络失败 | Docker IPv6 支持、官方配置的 IPv6 子网及地址冲突 |
| 更新后配置似乎丢失 | 是否在原项目目录启动、`./data` 是否仍挂载到原数据目录 |

常用诊断命令，在 Compose 项目目录执行：

```bash
docker compose ps
docker compose logs --tail=100 frontend backend
docker compose logs --tail=100 remote-gateway guacd

# 持续查看后端日志，Ctrl+C 退出查看，不会停止服务。
docker compose logs -f --tail=100 backend
```

分享排障日志前，应移除密码、密钥、令牌及其他敏感信息。

# 【十一】官方参考资料

- [项目与中文 README](https://github.com/Heavrnl/nexus-terminal)
- [Docker Compose 配置](https://github.com/Heavrnl/nexus-terminal/blob/main/docker-compose.yml)
- [环境变量示例](https://github.com/Heavrnl/nexus-terminal/blob/main/.env)
- [版本发布与桌面端下载](https://github.com/Heavrnl/nexus-terminal/releases)
- [ARMv7 部署配置](https://github.com/Heavrnl/nexus-terminal/blob/main/doc/arm/docker-compose.yml)
