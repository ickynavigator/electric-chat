import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { env } from '../env/server';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __ELECTRIC_URL__: JSON.stringify(env.ELECTRIC_URL),
    __DEBUG_MODE__: JSON.stringify(env.DEBUG_MODE === 'true'),
  },
});
