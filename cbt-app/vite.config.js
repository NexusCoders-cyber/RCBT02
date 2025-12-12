import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 5000,
  },
  define: {
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
    'import.meta.env.VITE_POE_API_KEY': JSON.stringify(process.env.VITE_POE_API_KEY),
    'import.meta.env.VITE_GROK_API_KEY': JSON.stringify(process.env.VITE_GROK_API_KEY),
    'import.meta.env.VITE_CEREBRAS_API_KEY': JSON.stringify(process.env.VITE_CEREBRAS_API_KEY),
  },
})
