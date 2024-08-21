import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'firebase/auth': 'firebase/auth/dist/index.esm.js',
      'firebase/app': 'firebase/app/dist/index.esm.js',
      'firebase/database': 'firebase/database/dist/index.esm.js'
    }
  }
});
