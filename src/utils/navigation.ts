/**
 * 导航相关工具函数
 */

/**
 * 返回上一页
 * 如果没有上一页，则跳转到首页
 */
export const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // 如果没有历史记录，跳转到首页
    window.location.href = '/';
  }
};

/**
 * 使用 Vue Router 返回上一页
 * 需要在 Vue 组件中使用
 */
export const useGoBack = () => {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return { goBack };
};

/**
 * 跳转到指定页面
 */
export const navigateTo = (path: string) => {
  window.location.href = path;
};

/**
 * 使用 Vue Router 跳转到指定页面
 */
export const useNavigateTo = () => {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const replaceTo = (path: string) => {
    router.replace(path);
  };

  return { navigateTo, replaceTo };
};

/**
 * 获取当前页面路径
 */
export const getCurrentPath = (): string => {
  return window.location.pathname;
};

/**
 * 获取查询参数
 */
export const getQueryParams = (key?: string): string | Record<string, string> => {
  const urlParams = new URLSearchParams(window.location.search);

  if (key) {
    return urlParams.get(key) || '';
  }

  const params: Record<string, string> = {};
  urlParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
};

// 导入 Vue Router 的 composable
import { useRouter } from 'vue-router';
