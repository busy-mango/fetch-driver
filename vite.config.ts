import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    testTimeout: 20000,
  },
  build: {
    target: ['es2016', 'chrome65'],
    lib: {
      entry: 'index.ts',
      fileName: 'index',
      name: '@busymango/fetch-driver',
    },
    rollupOptions: {
      external: ['mime', '@busymango/is-esm'],
      output: {
        name: '@busymango/fetch-driver',
        globals: {
          'mime': 'mime',
          '@busymango/is-esm': '@busymango/is-esm',
        },
      },
    },
  },
});
