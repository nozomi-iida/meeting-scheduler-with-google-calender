import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { join } from 'path';
import { defineConfig } from 'vite';

import manifest from './src/manifest';
import removeSrcFromHtmlPaths from './utils/plugins/removeSrcFromHtmlPaths';

export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     input: {
  //       options: join(__dirname, 'src/options/options.html'),
  //     },
  //     output: {
  //       chunkFileNames: 'assets/chunk-[hash].js',
  //     },
  //   },
  // },
  plugins: [react(), crx({ manifest }), removeSrcFromHtmlPaths()],
});
