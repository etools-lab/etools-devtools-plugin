import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  clean: true,
  external: ['@etools/plugin-sdk', 'react', 'react-dom'],
  splitting: false,
  sourcemap: true,
  minify: false,
});
