import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
console.log('------------------------------------\n',resolve(dirname(fileURLToPath(import.meta.url)), 'src'))
// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
    alias:{
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
      '@util': resolve(dirname(fileURLToPath(import.meta.url)), 'src', 'util')
    }
  },
  plugins: [vue()],
})
