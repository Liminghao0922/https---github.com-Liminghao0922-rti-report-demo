# PowerBI Report Web Application

这是一个显示 Power BI 报告的网站应用，支持可选的 Omniverse Streaming 和 EventHub 集成。

## 主要功能

### 1. Power BI 报告显示（必需）
- 用户登录后始终显示 Power BI 报告
- 报告背景设置为透明，占据屏幕左侧 50%
- 自适应高度，充满整个视口

### 2. Omniverse Streaming（可选）
- 如果在 `.env` 文件中配置了有效的 `SESSION_SERVICE_URL`，则显示 Omniverse 流媒体
- 流媒体显示在屏幕右侧 50%
- 如果未配置，显示占位符背景图片

### 3. EventHub 集成（可选）
- 如果在 `.env` 文件中配置了有效的 `EVENTHUB_RESOURCE_URL`，则启用 EventHub 流
- 用于实时数据流处理

## 配置说明

### 必需配置
在 `.env` 文件中必须配置以下 Power BI 相关项：

```env
# Power BI（必需）
POWERBI_REQUEST_SCOPE='https://analysis.windows.net/powerbi/api/Report.Read.All'
POWERBI_BASIC_FILTER_SCHEMA='http://powerbi.com/product/schema#basic'
POWERBI_VISUAL_ID='你的视觉ID'
POWERBI_TABLE_NAME='你的表名'
POWERBI_TABLE_COLUMN_NAME='你的列名'
POWERBI_REPORT_ID='你的报告ID' # xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
POWERBI_EMBED_URL='https://app.powerbi.com/reportEmbed?reportId=<reportid>&ctid=<ctid>'
```

### 可选配置

#### Omniverse Streaming（可选）
如果需要 Omniverse 流媒体功能，配置：

```env
# Session Management（可选）
SESSION_SERVICE_URL='https://your-streaming-url.com/'

# USD Storage（如果使用 Streaming）
USD_PATH='https://yourstorage.blob.core.windows.net/container/file.usd'
USD_SAS_TOKEN='你的SAS令牌'
USD_HOST_NAME='yourstorage.blob.core.windows.net'
USD_CONTAINER_NAME='你的容器名'
```

#### Event Hub（可选）
如果需要 EventHub 实时数据流，配置：

```env
# Event Hub（可选）
EVENTHUB_REQUEST_SCOPE='https://eventhubs.azure.net/.default'
EVENTHUB_RESOURCE_URL='your-eventhub.servicebus.windows.net'
EVENTHUB_NAME='你的eventhub名称'
EVENTHUB_GROUP_NAME='$Default'
```

## 布局说明

### 有 Streaming 配置时：
```
+------------------+------------------+
|                  |                  |
|   Power BI       | Omniverse        |
|   Report         | Streaming        |
|   (50%)          | (50%)            |
|                  |                  |
+------------------+------------------+
```

### 无 Streaming 配置时：
```
+------------------+------------------+
|                  |                  |
|   Power BI       | 占位符背景       |
|   Report         | (灰色渐变 +      |
|   (50%)          |  提示文字)       |
|                  |                  |
+------------------+------------------+
```

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 配置 `.env` 文件（至少配置 Power BI 相关项）

3. 运行开发服务器：
```bash
npm run dev
```

4. 构建生产版本：
```bash
npm run build
```

## 技术栈

- React 18
- TypeScript
- Vite
- Redux Toolkit
- Azure MSAL（Microsoft 认证）
- Power BI Embedded
- Omniverse WebRTC Streaming Library（可选）
- Azure Event Hubs（可选）

## 注意事项

1. **Power BI 配置是必需的** - 应用启动需要有效的 Power BI 配置
2. **Streaming 是可选的** - 不配置 SESSION_SERVICE_URL 时会显示占位符
3. **EventHub 是可选的** - 不配置 EVENTHUB_RESOURCE_URL 时不会启动 EventHub 客户端
4. **透明背景** - Power BI 报告使用透明背景，可以看到后面的内容
5. **响应式设计** - 布局会根据视口大小自动调整
