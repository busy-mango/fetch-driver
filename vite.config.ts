import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: ['es2016', 'chrome65'],
    lib: {
      entry: './index.ts',
      fileName: 'index',
      name: '@busymango/fetch-driver',
    },
    rollupOptions: {
      external: ['mime', '@busymango/is-esm'],
    }
  }
});
