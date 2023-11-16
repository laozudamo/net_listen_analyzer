import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { join } from 'path'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    base: '/',
    alias: {
      '@': join(__dirname, 'src/')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/styles/variable.scss';`
      },
    }
  },
  esbuild: {
    jsxFactory: 'h',
    // jsxFragment: 'Fragment',
  },
  server: {
    // hmr: true,
    host: true,
    port: 5188,
  },
  build: {
    target: ['edge90', 'chrome90', 'firefox90', 'safari15'],
    cssTarget: 'chrome80',
    brotliSize: false,
    chunkSizeWarningLimit: 300,
    rollupOptions: {
      output: {
        manualChunks (id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }

      }

    }
  }
},)