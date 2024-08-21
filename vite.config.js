import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',  // o 'chrome91' si prefieres usar un navegador específico
    rollupOptions: {
      external: [
        'firebase/app',
        'firebase/auth',
        'firebase/database',
        'firebase/firestore',
        'firebase/storage',
        'firebase/messaging',
        'firebase/functions',
        'firebase/analytics'
      ]
    }
  }
})
