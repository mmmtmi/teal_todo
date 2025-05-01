import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import{ resolve } from 'path'
import  * as path from 'path'


// https://vite.dev/config/
export default defineConfig({
  
  server: {
    allowedHosts: ['molynote.com'],
  },

  resolve:{
    alias:{
      '@': resolve(__dirname, 'src'),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  plugins: [vue()],
})


