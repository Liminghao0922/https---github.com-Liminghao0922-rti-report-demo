# Power BI Report Website Application - Setup & Usage Guide

## Overview

This application is a React and TypeScript-based website designed to display Power BI reports. The application supports optional Omniverse Streaming and Azure EventHub integration.

## Core Features

### ✅ Required Features
- **Power BI Report Embedding**: Display interactive Power BI reports after login
- **Azure AD Authentication**: Sign in with Microsoft account

### 🔧 Optional Features
- **Omniverse Streaming**: Real-time 3D visualization (optional)
- **EventHub Integration**: Real-time data stream processing (optional)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example configuration file:
```bash
copy .env.example .env
```

Edit the `.env` file and configure at least these required items:

```env
# Power BI Configuration (REQUIRED)
POWERBI_REPORT_ID='your-report-id'
POWERBI_EMBED_URL='your-embed-url'
POWERBI_TABLE_NAME='your-table-name'
POWERBI_TABLE_COLUMN_NAME='your-column-name'
POWERBI_VISUAL_ID='your-visual-component-id'

# Azure AD Authentication (REQUIRED)
MSAL_CONFIG_CLIENT_ID='your-azure-ad-application-id'
MSAL_CONFIG_CLIENT_AUTHORITY='https://login.microsoftonline.com/your-tenant-id'
```

### 3. Start the Application

Development mode:
```bash
npm run dev
```

The application will start at `http://localhost:5173`

### 4. Login

1. Navigate to the application URL
2. Click the login button
3. Sign in with your Microsoft account
4. After successful login, the Power BI report will be displayed

## Configuration Details

### Power BI Configuration - How to Obtain Values

#### 1. Get Report ID and Embed URL

1. Sign in to [Power BI Service](https://app.powerbi.com)
2. Open your report
3. Extract the Report ID from the browser URL:
   ```
   https://app.powerbi.com/groups/.../reports/[YOUR-REPORT-ID]/...
   ```
4. Embed URL format:
   ```
   https://app.powerbi.com/reportEmbed?reportId=[Report ID]&ctid=[Tenant ID]
   ```

#### 2. Get Visual ID (For Slicers)

1. Open the report in Power BI Desktop or Service
2. Enter edit mode
3. Go to **View** > **Selection Pane**
4. Find your slicer name in the Selection Pane - this is your Visual ID

#### 3. Table Name and Column Name

These are the table and column names you use in your Power BI dataset for data filtering.

### Azure AD Application Configuration

1. In [Azure Portal](https://portal.azure.com), create an App Registration
2. Configure Redirect URI: `http://localhost:5173`
3. Add Power BI API permissions:
   - `Report.Read.All`
4. Record the Application (Client) ID and Tenant ID

### Optional Feature Configuration

#### Omniverse Streaming (Optional)

If you have an NVIDIA Omniverse Streaming server:

```env
SESSION_SERVICE_URL='https://your-streaming-server.com/'
USD_PATH='https://yourstorage.blob.core.windows.net/container/file.usd'
USD_SAS_TOKEN='your-sas-token'
USD_HOST_NAME='yourstorage.blob.core.windows.net'
USD_CONTAINER_NAME='your-container-name'
```

**Behavior when not configured**: Placeholder background image is displayed

#### EventHub (Optional)

If you need real-time data streaming:

```env
EVENTHUB_REQUEST_SCOPE='https://eventhubs.azure.net/.default'
EVENTHUB_RESOURCE_URL='your-eventhub.servicebus.windows.net'
EVENTHUB_NAME='your-eventhub-name'
EVENTHUB_GROUP_NAME='$Default'
```

**Behavior when not configured**: EventHub component will not load

## User Interface Layout

### Full Configuration (Power BI + Streaming)

```
┌────────────────────────┬────────────────────────┐
│                        │                        │
│   Power BI Report      │  Omniverse Streaming   │
│   (Left 50%)           │  (Right 50%)           │
│   - Transparent BG     │  - 3D Visualization    │
│   - Interactive Report │  - Real-time Rendering │
│                        │                        │
└────────────────────────┴────────────────────────┘
```

### Power BI Only (Streaming Not Configured)

```
┌────────────────────────┬────────────────────────┐
│                        │                        │
│   Power BI Report      │   Placeholder BG       │
│   (Left 50%)           │   (Right 50%)          │
│   - Transparent BG     │   - Gradient BG        │
│   - Interactive Report │   - "Not Configured"   │
│                        │                        │
└────────────────────────┴────────────────────────┘
```

## Build and Deployment

### Build Production Version

```bash
npm run build
```

Build artifacts are in the `dist` directory

### Deploy to Azure Static Web Apps

1. Create a Static Web App in Azure Portal
2. Configure build settings:
   - App location: `/`
   - Output location: `dist`
3. Configure environment variables in Azure Static Web App (same as `.env`)

## Troubleshooting

### Power BI Report Not Displaying

**Check these items**:
1. ✓ Is POWERBI_REPORT_ID correct?
2. ✓ Is POWERBI_EMBED_URL format correct?
3. ✓ Does Azure AD application have Report.Read.All permission?
4. ✓ Does the user have permission to access the report?
5. ✓ Are there error messages in the browser console?

### Login Failed

**Check these items**:
1. ✓ Is MSAL_CONFIG_CLIENT_ID correct?
2. ✓ Is MSAL_CONFIG_CLIENT_AUTHORITY tenant ID correct?
3. ✓ Is the Redirect URI configured in Azure AD application?
4. ✓ Can the network access login.microsoftonline.com?

### Streaming Not Displaying

**This is normal**: Streaming is an optional feature
- If Streaming is not needed, a placeholder background will be displayed automatically
- If you want Streaming, ensure SESSION_SERVICE_URL is configured with a valid value

## Region-Based Filter Buttons

### Feature Overview

The application includes region-based filter buttons for quick Power BI report filtering:

- **North**: Filter to North region data
- **South**: Filter to South region data  
- **East**: Filter to East region data
- **West**: Filter to West region data
- **Clear**: Reset all filters

### How to Use

1. After Power BI report loads, filter buttons appear below the report
2. Click a region button to filter the report
3. The report will update immediately with filtered data
4. Click "Clear" to reset and show all data

### Customization

To modify the available regions or add new filters:

1. Edit `src/components/FilterButtonPanel.tsx`
2. Modify the `regions` array:
   ```typescript
   const regions = ['North', 'South', 'East', 'West'];
   ```
3. Update the filter service configuration in the same file
4. Rebuild with `npm run build`

## Using Filter Buttons with Power BI

### Filter Button Visibility

Filter buttons are displayed:
- ✅ When Power BI report is successfully loaded
- ✅ When Omniverse Streaming is **NOT** configured
- ❌ When Omniverse Streaming **IS** configured (layout space limitation)

### Understanding the Filter Service

The application uses `PowerBIFilterService` to manage filter operations:

- Filters are applied using Power BI's native filter API
- Filters persist while the report is loaded
- Filters are cleared when the page is refreshed
- Multiple filters can be applied together

### Technical Details

Internally, filter buttons use Power BI's `setFilters()` API to apply `IBasicFilter`:

```typescript
// Example: Filter North region data
const filter: IBasicFilter = {
  $schema: 'http://powerbi.com/product/schema#basic',
  target: {
    table: 'YourTableName',
    column: 'YourColumnName'
  },
  operator: 'In',
  values: ['North']
};
```

## Testing the Application

### Test Scenario 1: Power BI Only
1. Configure `.env` with only Power BI settings
2. Keep SESSION_SERVICE_URL as `<ovestreamingurl>` (placeholder)
3. Run `npm run dev`
4. **Expected**: Power BI on left, placeholder background on right

### Test Scenario 2: Power BI + Streaming
1. Configure `.env` with Power BI and Streaming URLs
2. Run `npm run dev`
3. **Expected**: Power BI on left, Omniverse Streaming on right

### Test Scenario 3: With Filter Buttons
1. Configure Power BI only (no Streaming)
2. Run `npm run dev`
3. Click a region filter button
4. **Expected**: Power BI report updates with filtered data

## Technical Support

- Power BI Documentation: [Power BI Docs](https://docs.microsoft.com/power-bi/)
- Azure AD Authentication: [MSAL.js Documentation](https://docs.microsoft.com/azure/active-directory/develop/msal-overview)
- Omniverse Streaming: [NVIDIA Documentation](https://docs.omniverse.nvidia.com/)

## License

See LICENSE.md file for details
