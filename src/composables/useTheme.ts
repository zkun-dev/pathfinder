import { ref, watch, computed, onMounted } from 'vue';

type Theme = 'light' | 'dark';

// 单例模式：确保所有组件共享同一个 theme 实例
let themeInstance: ReturnType<typeof createTheme> | null = null;

function createTheme() {
  const getInitialTheme = (): Theme => {
    // 优先使用 localStorage 中保存的主题
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // 其次使用系统偏好
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    // 默认使用深色主题
    return 'dark';
  };

  const theme = ref<Theme>(getInitialTheme());

  const applyTheme = () => {
    const root = document.documentElement;
    
    // 移除旧的主题类
    root.classList.remove('light', 'dark');
    
    // 添加新的主题类
    root.classList.add(theme.value);
    
    // 设置 data-theme 属性（用于某些 CSS 选择器）
    root.setAttribute('data-theme', theme.value);
    
    // 保存到 localStorage
    localStorage.setItem('theme', theme.value);
    
    // 触发自定义事件，让其他组件可以监听主题变化
    window.dispatchEvent(new CustomEvent('theme-change', { detail: theme.value }));
  };

  // 监听系统主题变化
  const watchSystemTheme = () => {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        // 只有在没有手动设置主题时才跟随系统
        if (!localStorage.getItem('theme')) {
          theme.value = e.matches ? 'dark' : 'light';
        }
      };
      
      // 现代浏览器
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // 旧浏览器兼容
        mediaQuery.addListener(handleChange);
      }
    }
  };

  // 监听主题变化并应用
  watch(theme, applyTheme, { immediate: true });

  // 组件挂载时监听系统主题
  onMounted(() => {
    watchSystemTheme();
    applyTheme();
  });

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
  };

  const isDark = computed(() => theme.value === 'dark');
  const isLight = computed(() => theme.value === 'light');

  return {
    theme,
    toggleTheme,
    setTheme,
    isDark,
    isLight
  };
}

export function useTheme() {
  // 如果实例已存在，直接返回
  if (themeInstance) {
    return themeInstance;
  }

  // 创建新实例
  themeInstance = createTheme();
  
  // 初始化系统主题监听（只需要一次）
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有手动设置主题时才跟随系统
      if (!localStorage.getItem('theme') && themeInstance) {
        themeInstance.theme.value = e.matches ? 'dark' : 'light';
      }
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }
  }

  return themeInstance;
}
