import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import ElementPlus from 'unplugin-element-plus/vite';
import { defineConfig, loadEnv } from 'vite';

const projectRoot = process.cwd();
const frontendRoot = path.resolve(projectRoot, 'src');

function normalizeSlashes(value: string) {
  return value.split(path.sep).join('/');
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, 'VITE_');
  const port = Number(env.VITE_PORT || '5777');

  return {
    base: env.VITE_BASE || '/',
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: (content: string, filePath: string) => {
            const relativePath = normalizeSlashes(path.relative(projectRoot, filePath));
            if (relativePath.startsWith('src/vben/styles/')) {
              return content;
            }
            return `@use "@/vben/styles/global/index.scss" as *;\n${content}`;
          },
        },
      },
    },
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(
        process.env.npm_package_version ?? '5.7.0',
      ),
    },
    plugins: [
      vue({
        script: {
          defineModel: true,
        },
      }),
      vueJsx(),
      tailwindcss(),
      ElementPlus({
        format: 'esm',
      }),
    ],
    resolve: {
      alias: {
        '@': frontendRoot,
      },
    },
    server: {
      host: true,
      port,
      proxy: {
        '/api': {
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api/, ''),
          target: 'http://localhost:5320/api',
          ws: true,
        },
      },
    },
    build: {
      outDir: 'dist/app',
      target: 'es2020',
    },
  };
});
