import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import VueRouter from 'unplugin-vue-router/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest.js';

export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '/user-api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user-api/, ''),
      },
    },
  },
  plugins: [
    VueRouter({
      importMode: 'sync',
    }),
    AutoImport({
      include: [/\.vue$/, /\.vue\?vue/, /\.js$/, /\.md$/],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          axios: [['default', 'axios']],
          quasar: ['useQuasar'],
        },
      ],
      dirs: ['src/stores'],
      dts: './auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    Components({}),
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: 'src/quasar-variables.sass',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,ttf,otf,woff,woff2,jpeg,jpg}'],
        mode: 'development',
        runtimeCaching: [
          {
            urlPattern: /http:\/\/localhost:3000\/auth\/user/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'database-takenotes',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 1,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
