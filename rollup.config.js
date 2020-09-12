import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;
const bundleCss = production ? 'dist/svetamat.css' : 'bundle.css';

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

export default {
  input: !production ? 'src/main.js' : 'src/index.js',
  output: !production ? {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js',
  } : [
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
        name,
      },
      {
        file: pkg.main,
        format: 'umd',
        sourcemap: true,
        name,
      },
    ],
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ postcss: true }),
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write(bundleCss);
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      mainFields: ['svelte', 'module', 'main'],
      dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
    }),
    commonjs(),

    !production && serve({ port: 5001, contentBase: 'public' }),
    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload({ watch: 'public' }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
