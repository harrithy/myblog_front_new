# Utils - 工具函数

这个文件夹存放项目的通用工具函数。

## 文件结构

- `navigation.ts` - 导航相关工具函数
- `common.ts` - 通用工具函数
- `index.ts` - 统一导出文件

## 使用方法

### 1. 整体导入

```typescript
import { goBack, formatDate, debounce } from '@/utils';
```

### 2. 按模块导入

```typescript
import { goBack } from '@/utils/navigation';
import { formatDate, debounce } from '@/utils/common';
```

### 3. 在 Vue 组件中使用

```vue
<script setup lang="ts">
import { useGoBack, formatDate } from '@/utils';

const { goBack } = useGoBack();

const handleGoBack = () => {
  goBack();
};

const currentDate = formatDate(new Date());
</script>
```

## 主要功能

### Navigation (导航)

- `goBack()` - 返回上一页
- `useGoBack()` - Vue composable 版本的返回函数
- `navigateTo(path)` - 跳转到指定页面
- `useNavigateTo()` - Vue composable 版本的导航函数
- `getCurrentPath()` - 获取当前页面路径
- `getQueryParams(key?)` - 获取查询参数

### Common (通用)

- `formatDate(date, format?)` - 格式化日期
- `debounce(func, delay)` - 防抖函数
- `throttle(func, limit)` - 节流函数
- `deepClone(obj)` - 深拷贝对象
- `generateRandomString(length?)` - 生成随机字符串
- `isMobile()` - 检查是否为移动设备
- `copyToClipboard(text)` - 复制文本到剪贴板
- `downloadFile(url, filename?)` - 下载文件
- `formatFileSize(bytes)` - 格式化文件大小

## 注意事项

1. 确保在使用 Vue Router 相关函数时，已正确配置了 Vue Router
2. 防抖和节流函数返回的是新函数，需要正确使用
3. 复制到剪贴板功能在某些浏览器中可能需要用户交互
