import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  target: 'esnext',
  // treeshake: true,
  splitting: false,
  external: ['react', 'react-dom'],

  esbuildOptions(options) {
    options.platform = 'browser';
    options.mainFields = ['module', 'main'];
  },
});
