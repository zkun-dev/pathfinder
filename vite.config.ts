import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [vue(), tsconfigPaths()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist/static',
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      // 生产环境优化
      cssCodeSplit: true,
      reportCompressedSize: false, // 禁用压缩大小报告以加快构建速度
      chunkSizeWarningLimit: 1000, // 块大小警告限制（KB）
      rollupOptions: {
        output: {
          // 代码分割优化
          manualChunks: (id) => {
            // Vue 核心库
            if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router')) {
              return 'vue-vendor'
            }
            // Three.js 库
            if (id.includes('node_modules/three')) {
              return 'three-vendor'
            }
            // 工具库
            if (id.includes('node_modules/@vueuse') || 
                id.includes('node_modules/tailwind-merge') || 
                id.includes('node_modules/zod')) {
              return 'utils-vendor'
            }
          },
          // 文件命名规则
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
      } : undefined,
    },
    server: {
      host: true,
      port: 3000,
    },
  };
});
