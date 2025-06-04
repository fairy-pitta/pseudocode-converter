import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
    setupFiles: [],
    globals: true,
    watch: false,
    alias: {
      '@': path.resolve(__dirname, './'),
    },
    server: {
      deps: {
        inline: [/lib\/java-to-pseudocode-parser-ib.ts/, /lib\/java-ib\/.*/],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});