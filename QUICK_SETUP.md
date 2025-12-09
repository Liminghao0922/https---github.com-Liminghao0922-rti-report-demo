# Quick Setup Guide (快速设置指南)

## English Version

### Minimum Configuration (Power BI Only)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Power BI in .env**
   ```env
   # Required - Get from Power BI Service
   POWERBI_REPORT_ID='your-report-id'
   POWERBI_EMBED_URL='https://app.powerbi.com/reportEmbed?reportId=xxx&ctid=xxx'
   POWERBI_TABLE_NAME='YourTableName'
   POWERBI_TABLE_COLUMN_NAME='YourColumnName'
   POWERBI_VISUAL_ID='your-visual-id'
   
   # Required - Get from Azure AD
   MSAL_CONFIG_CLIENT_ID='your-client-id'
   MSAL_CONFIG_CLIENT_AUTHORITY='https://login.microsoftonline.com/your-tenant-id'
   
   # Leave as-is to disable optional features
   SESSION_SERVICE_URL='<ovestreamingurl>'
   EVENTHUB_RESOURCE_URL='<eventhubnamespace>.servicebus.windows.net'
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```

4. **Result**: Power BI report on left, placeholder background on right

---

## 中文版本

### 最小配置（仅 Power BI）

1. **安装依赖**
   ```bash
   npm install
   ```

2. **在 .env 中配置 Power BI**
   ```env
   # 必需 - 从 Power BI Service 获取
   POWERBI_REPORT_ID='你的报告ID'
   POWERBI_EMBED_URL='https://app.powerbi.com/reportEmbed?reportId=xxx&ctid=xxx'
   POWERBI_TABLE_NAME='你的表名'
   POWERBI_TABLE_COLUMN_NAME='你的列名'
   POWERBI_VISUAL_ID='你的视觉ID'
   
   # 必需 - 从 Azure AD 获取
   MSAL_CONFIG_CLIENT_ID='你的客户端ID'
   MSAL_CONFIG_CLIENT_AUTHORITY='https://login.microsoftonline.com/你的租户ID'
   
   # 保持不变以禁用可选功能
   SESSION_SERVICE_URL='<ovestreamingurl>'
   EVENTHUB_RESOURCE_URL='<eventhubnamespace>.servicebus.windows.net'
   ```

3. **运行应用**
   ```bash
   npm run dev
   ```

4. **结果**：左侧显示 Power BI 报告，右侧显示占位符背景

---

## Adding Optional Features (添加可选功能)

### Enable Omniverse Streaming (启用 Omniverse 流媒体)

Replace in .env (在 .env 中替换):
```env
SESSION_SERVICE_URL='https://your-actual-streaming-url.com/'
USD_PATH='https://yourstorage.blob.core.windows.net/container/file.usd'
USD_SAS_TOKEN='your-sas-token'
USD_HOST_NAME='yourstorage.blob.core.windows.net'
USD_CONTAINER_NAME='your-container'
```

### Enable EventHub (启用 EventHub)

Replace in .env (在 .env 中替换):
```env
EVENTHUB_RESOURCE_URL='your-eventhub.servicebus.windows.net'
EVENTHUB_NAME='your-eventhub-name'
```

---

## Troubleshooting (故障排除)

### Power BI not showing (Power BI 不显示)
- Check console for errors (检查浏览器控制台错误)
- Verify Report ID and Embed URL (验证报告 ID 和嵌入 URL)
- Ensure Azure AD permissions include Report.Read.All (确保 Azure AD 权限包含 Report.Read.All)

### Login fails (登录失败)
- Verify MSAL_CONFIG_CLIENT_ID (验证客户端 ID)
- Check redirect URI in Azure AD app (检查 Azure AD 应用中的重定向 URI)
- Ensure localhost:5173 is registered (确保 localhost:5173 已注册)

### Streaming not showing (流媒体不显示)
- This is normal if SESSION_SERVICE_URL is not configured (如果未配置 SESSION_SERVICE_URL，这是正常的)
- You should see a placeholder background (你应该看到占位符背景)
- To enable: add valid streaming URL (启用：添加有效的流媒体 URL)
