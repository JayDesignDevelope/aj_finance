import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// DSA Finance CRM dev server
export default defineConfig({
  plugins: [react()],
  server: { port: 5175, host: true },
});
