import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({


  server: {
    allowedHosts: ['molynote.com'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  plugins: [vue()],

  define: {
    'process.env': {}
  },
})