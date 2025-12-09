# GitHub Actions Deployment Guide

## Overview

This guide explains how to set up GitHub Actions to automatically deploy your Power BI Report Web Application to Azure Static Web Apps.

## Prerequisites

- A GitHub repository
- An Azure subscription
- An Azure Static Web App created in Azure Portal
- GitHub repository settings configured for Actions

## Step 1: Create Azure Static Web App

### 1.1 In Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource**
3. Search for **Static Web App** and click Create
4. Fill in the required information:
   - **Resource Group**: Create or select existing
   - **Name**: `powerbi-report-webapp` (or your preferred name)
   - **Region**: Select your region
   - **Hosting plan**: Free
   - **Azure Functions and staging details**: Skip for now

5. In **Deployment details**:
   - **Source**: GitHub
   - **Organization**: Select your GitHub account
   - **Repository**: Select this repository
   - **Branch**: main
   - **Build presets**: Vite
   - **App location**: `/`
   - **Api location**: (leave empty)
   - **Output location**: `dist`

6. Click **Review + create** then **Create**

### 1.2 GitHub Repository Connection

Azure will automatically create a GitHub Actions workflow and set up the deployment token.

## Step 2: Configure GitHub Secrets

### 2.1 Get Deployment Token

1. After creating the Static Web App, go to **Settings** → **Deployment credentials**
2. Copy the API token (this will be your `AZURE_STATIC_WEB_APPS_API_TOKEN`)

### 2.2 Add Secret to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Value: Paste the token from step 2.1
6. Click **Add secret**

## Step 3: Configure Environment Variables

Azure Static Web Apps require environment variables to be set in the Azure Portal, not in GitHub secrets.

### 3.1 Add Environment Variables to Static Web App

1. Go to Azure Portal
2. Navigate to your Static Web App resource
3. Click **Configuration** in the left sidebar
4. Add the following environment variables:

```
POWERBI_REPORT_ID=your-report-id
POWERBI_EMBED_URL=your-embed-url
POWERBI_TABLE_NAME=your-table-name
POWERBI_TABLE_COLUMN_NAME=your-column-name
POWERBI_VISUAL_ID=your-visual-id
MSAL_CONFIG_CLIENT_ID=your-client-id
MSAL_CONFIG_CLIENT_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
MSAL_CONFIG_REDIRECT_URI=https://your-static-web-app-url.azurestaticapps.net
MSAL_CONFIG_POST_LOGOUT_REDIRECT_URI=https://your-static-web-app-url.azurestaticapps.net
```

### 3.2 Optional Environment Variables

If you're using Omniverse Streaming or EventHub, add these as well:

```
SESSION_SERVICE_URL=your-streaming-url
USD_PATH=your-usd-path
USD_SAS_TOKEN=your-sas-token
USD_HOST_NAME=your-storage-host
USD_CONTAINER_NAME=your-container-name
EVENTHUB_RESOURCE_URL=your-eventhub-url
EVENTHUB_NAME=your-eventhub-name
EVENTHUB_GROUP_NAME=$Default
EVENTHUB_REQUEST_SCOPE=https://eventhubs.azure.net/.default
```

## Step 4: Update Redirect URIs in Azure AD

### 4.1 Update Azure AD App Registration

1. Go to Azure Portal
2. Navigate to **Azure Active Directory** → **App registrations**
3. Select your application
4. Click **Authentication**
5. Update **Redirect URIs** with your Static Web App URL:
   - Replace `http://localhost:5173` with your Static Web App URL
   - Example: `https://your-app-name.azurestaticapps.net`

6. Make sure **Allow public client flows** is set to **Yes**
7. Click **Save**

## Step 5: Workflow File

The workflow file is already created at `.github/workflows/azure-static-web-app-deploy.yml`

### Workflow Triggers

The workflow runs on:
- **Push** to `main` or `staging` branches
- **Pull requests** to `main` or `staging` branches
- **Closure** of pull requests (cleanup)

### Workflow Jobs

#### 1. Build and Deploy Job
- Checks out code with submodules
- Sets up Node.js 18
- Installs dependencies with `npm ci`
- Runs linter (with `continue-on-error: true`)
- Builds the application
- Deploys to Azure Static Web Apps
- Reports deployment status

#### 2. Close Pull Request Job
- Runs when pull requests are closed
- Cleans up the deployment preview

## Step 6: Test the Workflow

### 6.1 First Deployment

1. Push any change to the `main` branch
2. Go to GitHub repository → **Actions**
3. Watch the workflow run
4. Once completed, your app will be deployed to Azure Static Web Apps

### 6.2 Monitor Deployment

1. In GitHub, click **Actions** tab
2. Click the latest workflow run
3. Check the build and deployment logs
4. If successful, you'll see the Static Web App URL in the logs

## Step 7: Pull Request Previews

### 7.1 PR Preview Deployments

When you create a pull request:
1. The workflow automatically builds and deploys a preview
2. A comment is posted on the PR with the preview URL
3. The preview is automatically removed when the PR is closed or merged

### 7.2 Accessing Preview

1. Go to your PR
2. Look for Azure Static Web Apps preview comment
3. Click the preview URL to test your changes

## Troubleshooting

### Issue: Deployment Failed

**Possible Causes**:
1. Missing `AZURE_STATIC_WEB_APPS_API_TOKEN` secret
2. Build errors (check the workflow logs)
3. Invalid output location

**Solution**:
1. Verify the secret is set correctly
2. Check the build logs for errors
3. Ensure `dist` is the correct output directory

### Issue: Environment Variables Not Working

**Possible Causes**:
1. Variables not set in Azure Static Web App configuration
2. Variable names don't match code references

**Solution**:
1. Verify all environment variables are set in Azure Portal
2. Check that variable names match exactly (case-sensitive)
3. Redeploy after adding variables

### Issue: MSAL Login Not Working

**Possible Causes**:
1. Redirect URI not updated in Azure AD
2. `MSAL_CONFIG_REDIRECT_URI` doesn't match actual URL

**Solution**:
1. Update Azure AD app registration redirect URIs
2. Ensure environment variable matches the static web app URL

### Issue: Linter Warnings Block Deployment

**Current Settings**: Linter warnings are not blocking deployment (`continue-on-error: true`)

To change this behavior and fail on lint errors:
1. Edit `.github/workflows/azure-static-web-app-deploy.yml`
2. Change `continue-on-error: true` to `continue-on-error: false`
3. Fix all lint issues before deploying

## Advanced Configuration

### Custom Domain

1. In Azure Static Web App → **Custom domains**
2. Click **Add**
3. Enter your custom domain
4. Follow DNS configuration steps

### CORS Configuration

If you need CORS headers, create `staticwebapp.config.json` in the root:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "methods": ["GET", "POST"],
      "allowedRoles": ["authenticated"]
    }
  ],
  "responseOverrides": {
    "401": {
      "statusCode": 302,
      "redirect": "/.auth/login/github"
    }
  }
}
```

### Authentication

Azure Static Web Apps includes built-in authentication. Configure in Portal:
1. **Static Web App** → **Authentication**
2. Add identity providers (GitHub, Azure AD, etc.)
3. Configure redirect URIs

## Monitoring and Logs

### View Deployment Logs

1. GitHub: **Actions** tab → Select workflow run → View logs
2. Azure Portal: **Static Web App** → **Activity log**

### View Application Logs

1. Azure Portal: **Static Web App** → **Logs**
2. Azure Monitor: **Application Insights** (if configured)

## Security Best Practices

1. ✅ Use GitHub Secrets for sensitive tokens
2. ✅ Set environment variables in Azure Portal (not in code)
3. ✅ Enable HTTPS only (Static Web Apps default)
4. ✅ Use Azure AD for authentication
5. ✅ Enable role-based access control (RBAC) in Azure
6. ✅ Review deployment logs for security issues

## Rollback

To rollback to a previous deployment:

1. Go to Azure Portal
2. Navigate to **Static Web App** → **Deployments**
3. Find the previous successful deployment
4. Click the three dots menu
5. Select **Reactivate**

## Support

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Static Web Apps GitHub Action](https://github.com/Azure/static-web-apps-deploy)
