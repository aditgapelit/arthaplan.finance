import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Anda bisa ganti angka 3000 dengan port yang diinginkan
  },
})