import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/fitness-tracker/', // required for GitHub Pages
  plugins: [react()],
})
