import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 构建时间戳：注入为全局常量 __APP_VERSION__，
// 用于 iframe src 的缓存穿透（GitHub Pages HTML 缓存 max-age=600）
const buildVersion = String(Date.now())

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 部署在 https://LinTianzun.github.io/LinHTMLCSSJS/ 子路径下
  base: '/LinHTMLCSSJS/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(buildVersion),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
