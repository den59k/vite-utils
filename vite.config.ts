import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import buildintModules from 'builtin-modules'
import pkg from './package.json';

export default defineConfig({
  plugins: [ dts({ rollupTypes: true }) ],
  build: {
    minify: false,
    sourcemap: true,
    lib: {
      entry:  {
        index: "src/index.ts",
        fastifyRunner: "src/fastifyRunner/fastifyRunner",
        viteRunner: "src/viteRunner/viteRunner"
      },
      formats: [ "es", "cjs" ],
      name: "main"
    },
    rollupOptions: {
      external: [
        /^node:/,
        "fs",
        "path",
        "child_process",
        ...buildintModules,
        ...Object.keys(pkg.devDependencies)
      ],
    }
  },
})