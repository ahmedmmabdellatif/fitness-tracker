import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/fitness-tracker/', // Needed for GitHub Pages
  plugins: [react()],
})
