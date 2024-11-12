import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import preserveDirectives from 'rollup-preserve-directives';

export default defineConfig({
  plugins: [dts({ rollupTypes: true }), preserveDirectives()],
  build: {
    sourcemap: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        main: resolve(__dirname, 'src/index.tsx'),
        next: resolve(__dirname, 'src/next/index.ts'),
        'next-server': resolve(__dirname, 'src/next/server/index.ts'),
        remix: resolve(__dirname, 'src/remix/index.tsx'),
      },
      // the proper extensions will be added
      fileName: 'rownd',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'next'],
      output: {
        // Preserve directory structure
        preserveModules: true,
        preserveModulesRoot: 'src',
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
});
