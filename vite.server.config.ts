import path from 'node:path';

import { defineConfig } from 'vite';

const projectRoot = process.cwd();

export default defineConfig({
  build: {
    minify: false,
    outDir: 'dist/server',
    rollupOptions: {
      output: {
        entryFileNames: 'main.mjs',
      },
    },
    ssr: 'server/main.ts',
    target: 'node22',
  },
  resolve: {
    alias: {
      '~': path.resolve(projectRoot, 'server'),
    },
  },
});
