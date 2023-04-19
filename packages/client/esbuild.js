import esbuild from 'esbuild';
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals';

await esbuild.build({
  entryPoints: [
    './src/polyfill.ts',
    './src/ponyfill.ts',
    './src/view/main/index.ts',
    './src/view/post/index.ts',
  ],
  plugins: [minifyHTMLLiteralsPlugin()],
  outdir: 'dist',
  format: 'esm',
  minify: true,
  bundle: true,
});
