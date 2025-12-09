# Power BI 过滤按钮功能说明

## 功能概述

当 **Omniverse Streaming 未配置** 时，应用会在 Power BI 报告上方显示一个**区域过滤按钮面板**，允许用户通过点击按钮快速过滤报告数据。

## 工作原理

### 文件结构

| 文件 | 位置 | 用途 |
|------|------|------|
| `PowerBIFilterService.ts` | `src/service/` | 处理 Power BI 过滤逻辑 |
| `FilterButtonPanel.tsx` | `src/components/` | 过滤按钮 UI 组件 |
| `FilterButtonPanel.css` | `src/components/` | 按钮样式 |
| `PageLayout.tsx` | `src/` | 条件渲染按钮面板 |

### 执行流程

```
用户点击按钮 (North/South/East/West)
    ↓
FilterButtonPanel 调用 powerBIFilterService.applyRegionFilter()
    ↓
PowerBIFilterService 构建过滤器对象
    ↓
调用 report.setFilters([filter]) API
    ↓
Power BI 报告更新，显示过滤后的数据
```

## 配置项

使用您 `.env` 中的以下配置：

```env
POWERBI_TABLE_NAME='Campaign Analytics'      # Power BI 数据表名
POWERBI_TABLE_COLUMN_NAME='Region'           # 过滤列名
```

## 使用流程

### 1️⃣ 确保 Streaming 未配置

```env
# 这样配置时，过滤按钮会显示：
SESSION_SERVICE_URL='<ovestreamingurl>'  # 保持为占位符，不填实际 URL
```

### 2️⃣ 启动应用

```bash
npm run dev
```

### 3️⃣ 登录后查看

- 左侧显示 **Power BI Report**
- 左上方显示 **过滤按钮面板**（4 个区域按钮 + 清除按钮）
- 右侧显示 **占位符背景**

### 4️⃣ 点击按钮进行过滤

- **North** - 过滤显示北部地区数据
- **South** - 过滤显示南部地区数据
- **East** - 过滤显示东部地区数据
- **West** - 过滤显示西部地区数据
- **Clear** - 清除所有过滤器

## 按钮样式

按钮面板的样式特点：

- ✅ **活跃状态** - 点击过的按钮会高亮显示
- 📱 **响应式设计** - 在手机上也能正常显示
- 💬 **实时反馈** - 显示操作成功/失败消息
- 🎨 **微软设计风格** - 与 Power BI 风格一致

## 如果需要修改

### 修改区域列表

编辑 `FilterButtonPanel.tsx`:

```typescript
const regions = ['North', 'South', 'East', 'West'];  // ← 修改这里
```

### 修改过滤列

编辑 `.env`:

```env
POWERBI_TABLE_COLUMN_NAME='YourNewColumnName'  # 改为其他列名
```

### 添加更多功能

例如，在 `PowerBIFilterService.ts` 中添加：

```typescript
/**
 * 应用多值过滤
 */
async applyMultipleRegionFilter(regions: string[]): Promise<void> {
  // 实现多选过滤逻辑
}
```

## 故障排除

### ❌ 按钮点击没有效果

1. 检查 Power BI 报告是否加载完成
2. 检查浏览器控制台是否有错误
3. 确认 `POWERBI_TABLE_NAME` 和 `POWERBI_TABLE_COLUMN_NAME` 正确

### ❌ 按钮不显示

1. 确认 `SESSION_SERVICE_URL` 设置为 `<ovestreamingurl>`（占位符）
2. 确认已登录
3. 清除浏览器缓存后刷新

### ❌ 过滤器应用失败

- 检查 Power BI 报告中是否真的存在该列
- 检查列中是否包含 'North'/'South' 等值
- 查看浏览器控制台的错误信息

## 代码示例

### 直接调用 Service

如果需要在其他组件中使用过滤功能：

```typescript
import { powerBIFilterService } from '../service/PowerBIFilterService';

// 应用过滤
await powerBIFilterService.applyRegionFilter('North');

// 清除过滤
await powerBIFilterService.clearFilters();
```

### 在其他组件中

```typescript
const MyComponent = () => {
  const handleFilter = async () => {
    await powerBIFilterService.applyRegionFilter('East');
  };

  return <button onClick={handleFilter}>Filter by East</button>;
};
```

## 总结

✅ 简单的点击过滤功能已实现  
✅ 仅在未配置 Streaming 时显示  
✅ 与现有代码无缝集成  
✅ 完全可定制  
✅ 生产级别的代码质量
