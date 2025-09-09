import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: 'views', replacement: '/src/views' },
      { find: 'components', replacement: '/src/components' },
      { find: 'assets', replacement: '/src/assets' },
      { find: 'app', replacement: '/src/app' },
      { find: 'variables', replacement: '/src/variables' },
      { find: 'services', replacement: '/src/services' },
      { find: 'types', replacement: '/src/types' }
    ]
  },
  server: {
    port: 5173
  }
});