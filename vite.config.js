import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // 👉 use "./" only if deploying on subfolder or cPanel
  base: "./",

  build: {
    outDir: "dist",
  },
})
