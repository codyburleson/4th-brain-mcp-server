import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ObsidianMCPServer',
      fileName: 'index',
      formats: ['cjs']
    },
    rollupOptions: {
      external: [
        '@modelcontextprotocol/sdk',
        'node:fs',
        'node:path',
        'node:process',
        'node:url',
        'node:events',
        'node:stream',
        'node:string_decoder',
        'node:fs/promises',
        'fs',
        'path'
      ],
      output: {
        banner: '#!/usr/bin/env node\n'
      }
    },
    target: 'node18',
    minify: false,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});