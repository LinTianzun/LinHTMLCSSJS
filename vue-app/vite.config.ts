import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

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
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'LinHTMLCSSJS · 前端练习合集',
        short_name: '前端练习',
        description: '从原生 HTML/CSS/JS 练习到 Vue 3 组件化移植的前端学习作品集',
        lang: 'zh-CN',
        display: 'standalone',
        start_url: '.',
        theme_color: '#2b3a67',
        background_color: '#f0ede4',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 只预缓存代码；6MB 中文字体子集和 demos 下的大图片/音频不进预缓存，走运行时缓存
        globPatterns: ['**/*.{js,css,html,ico,svg}'],
        globIgnores: ['**/fonts/**'],
        runtimeCaching: [
          {
            urlPattern: /\/demos\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'demo-assets',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            // 自托管字体：首次用到哪个子集就缓存哪个子集
            urlPattern: /\/fonts\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'site-fonts',
              expiration: {
                maxEntries: 120,
                maxAgeSeconds: 180 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
    }),
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
