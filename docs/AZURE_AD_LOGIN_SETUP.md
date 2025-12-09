# Azure AD 登录配置指南

## 问题解决
您提到登录按钮不好使的问题已经修复。之前的问题是：
- MSAL 认证配置中 `clientId` 和 `authority` 为空字符串
- 环境变量没有正确传递到认证配置

现在所有认证配置都从 `.env` 环境变量读取，默认值为空。

## 必需配置

在 `.env` 文件中配置以下 **必需的** Azure AD 认证项：

```env
# ========================================
# Azure AD / MSAL Authentication (REQUIRED)
# ========================================
MSAL_CONFIG_CLIENT_ID='<your-client-id>'
MSAL_CONFIG_CLIENT_AUTHORITY='https://login.microsoftonline.com/<tenant-id>'
MSAL_CONFIG_REDIRECT_URI='http://localhost:5173'
MSAL_CONFIG_POST_LOGOUT_REDIRECT_URI='http://localhost:5173'
```

## 如何获取这些值

### 1. 获取 Client ID 和 Tenant ID

1. 访问 [Azure Portal](https://portal.azure.com)
2. 搜索 "App registrations" (应用注册)
3. 点击 "New registration" (新建注册)
4. 填写应用名称，其他保持默认，点击 Register
5. 在 Overview 页面找到：
   - **Application (client) ID** → 复制到 `MSAL_CONFIG_CLIENT_ID`
   - **Directory (tenant) ID** → 复制到 `MSAL_CONFIG_CLIENT_AUTHORITY` 中的 `<tenant-id>`

### 2. 配置 Redirect URI

1. 在应用注册中，左侧菜单点击 "Authentication"
2. 点击 "Add a platform"
3. 选择 "Single-page application (SPA)"
4. 在 "Redirect URIs" 中添加：
   ```
   http://localhost:5173
   ```
5. 点击 "Configure"
6. 确保勾选 "Implicit grant and hybrid flows" 中的：
   - ☑ Access tokens
   - ☑ ID tokens
7. 点击 "Save"

### 3. 配置 Power BI 权限

1. 在应用注册中，左侧菜单点击 "API permissions"
2. 点击 "Add a permission"
3. 在右侧面板中点击 "Power BI Service"
4. 选择 "Delegated permissions"
5. 勾选 `Report.Read.All`
6. 点击 "Add permissions"
7. **重要**：点击 "Grant admin consent for [your tenant]" 并确认

### 4. 完整的 .env 示例

```env
# Azure AD Authentication
MSAL_CONFIG_CLIENT_ID='12345678-1234-1234-1234-123456789abc'
MSAL_CONFIG_CLIENT_AUTHORITY='https://login.microsoftonline.com/87654321-4321-4321-4321-cba987654321'
MSAL_CONFIG_REDIRECT_URI='http://localhost:5173'
MSAL_CONFIG_POST_LOGOUT_REDIRECT_URI='http://localhost:5173'

# Power BI Configuration
POWERBI_REPORT_ID='your-report-id'
POWERBI_EMBED_URL='https://app.powerbi.com/reportEmbed?reportId=...&ctid=...'
POWERBI_TABLE_NAME='YourTable'
POWERBI_TABLE_COLUMN_NAME='YourColumn'
POWERBI_VISUAL_ID='your-visual-id'
```

## 生产环境配置

### 对于 Azure Static Web Apps

在 Azure Portal 中的 Static Web App 配置中添加环境变量：

1. 进入 Static Web App
2. Settings → Configuration
3. 添加应用设置（Application Settings）：
   ```
   MSAL_CONFIG_CLIENT_ID = your-client-id
   MSAL_CONFIG_CLIENT_AUTHORITY = https://login.microsoftonline.com/your-tenant-id
   MSAL_CONFIG_REDIRECT_URI = https://your-domain.azurestaticapps.net
   MSAL_CONFIG_POST_LOGOUT_REDIRECT_URI = https://your-domain.azurestaticapps.net
   ```

4. **重要**：更新 Azure AD 应用的 Redirect URI
   - 在 Azure AD 应用注册中添加生产 URL
   - 例如：`https://your-domain.azurestaticapps.net`

## 测试登录

1. 确保配置了正确的 Client ID 和 Authority
2. 运行：
   ```bash
   npm run dev
   ```
3. 访问 `http://localhost:5173`
4. 点击 "Sign in" 按钮
5. 应该被重定向到 Microsoft 登录页面
6. 输入 Azure AD 账户凭证
7. 同意请求的权限
8. 应该返回应用并显示 Power BI 报告

## 故障排除

### 登录页面白屏
**原因**：Client ID 或 Authority 为空
**解决**：检查 `.env` 文件确保 `MSAL_CONFIG_CLIENT_ID` 和 `MSAL_CONFIG_CLIENT_AUTHORITY` 已填写

### "Invalid request" 错误
**原因**：Redirect URI 未在 Azure AD 中注册
**解决**：
1. 检查当前 URL（例如 `http://localhost:5173`）
2. 在 Azure AD 应用的 Authentication 页面添加该 URI
3. 刷新页面重试

### 权限相关错误
**原因**：Azure AD 应用缺少必要权限
**解决**：
1. 添加 Power BI Service API 权限
2. 授予 `Report.Read.All` 权限
3. 点击 "Grant admin consent"

### EventHub 连接失败（如果已配置）
**原因**：不是登录问题，是 EventHub 配置问题
**解决**：这是正常的，EventHub 是可选的；如果不需要可以不配置

## 相关文件

- `.env` - 存储所有配置值
- `src/authConfig.tsx` - MSAL 认证配置
- `src/main.tsx` - MSAL 实例初始化
- `src/NavigationBar.tsx` - 登录/登出按钮

## 更多信息

- [Microsoft MSAL.js 文档](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [Azure AD 应用注册文档](https://docs.microsoft.com/en-us/azure/active-directory/develop/app-registration-setup)
- [Power BI Embedded 认证](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embedded-service-authentication)
