/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */
/** WARNING: DON'T EDIT THIS FILE */

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

function getPlugins() {
  const plugins = [vue(), tsconfigPaths()];
  return plugins;
}

export default defineConfig(({ mode }) => {
  // 根据环境模式判断
  const isProduction = mode === 'production';
  
  return {
    plugins: getPlugins(),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist/static",
      // 生产环境不生成 sourcemap，开发环境生成
      sourcemap: !isProduction,
      minify: isProduction ? "terser" : false,
      rollupOptions: {
        output: {
          manualChunks: {
            "vue-vendor": ["vue", "vue-router"],
            "three-vendor": ["three"],
            "utils-vendor": ["@vueuse/core", "@vueuse/motion", "tailwind-merge", "zod"],
          },
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      },
      terserOptions: {
        compress: {
          // 生产环境移除 console 和 debugger
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
    },
    server: {
      host: true,
      port: 3000,
    },
  };
});
