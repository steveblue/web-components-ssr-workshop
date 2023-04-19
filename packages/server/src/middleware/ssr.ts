import { render } from '@lit-labs/ssr/lib/render-with-global-dom-shim.js';
import { html } from 'lit';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { minify } from 'html-minifier-terser';
import { Buffer } from 'buffer';
import { Readable } from 'stream';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as esbuild from 'esbuild';

import { routes } from '../../../client/src/routes.js';

const env = process.env.NODE_ENV || 'development';

const clientPath = (directory: 'src' | 'dist', route: any) => {
  return resolve(
    `${process.cwd()}../../client/${directory}/view/${route.component}/index.js`
  );
};
const stylePath = (filename) =>
  resolve(`${process.cwd()}../../style/${filename}`);
const readStyleFile = (filename) =>
  readFileSync(stylePath(filename)).toString();

const styles = await minify(readStyleFile('style.css'), {
  minifyCSS: true,
  removeComments: true,
  collapseWhitespace: true,
});

export const sanitizeTemplate = async (template) => {
  return html`${unsafeHTML(template)}`;
};

async function streamToString(stream) {
  const chunks = [];
  for await (let chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf-8');
}

async function renderStream(stream) {
  return await streamToString(Readable.from(stream));
}

function* renderApp(route, template, script) {
  yield `<!DOCTYPE html>
  <html lang="en">
    <head>
        <title>${route.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Web Components Blog">
        <style rel="stylesheet" type="text/css">${styles}</style>
    </head>
    <body> 
      <div id="root">`;
  yield* render(template);
  yield `</div>
    <script type="module">${script}</script>
  </body></html>`;
}

export default async (req, res) => {
  let fetchedData;

  let route = routes.find((r) => {
    // handle base url
    if (
      (r.path === '/' && req.originalUrl == '') ||
      (r.path && r.path === req.originalUrl)
    ) {
      return r;
    }
    // handle other routes
    if (r.pathMatch?.test(req.originalUrl)) {
      return r;
    }
  });

  if (route === undefined) {
    res.redirect(301, '/404');
    return;
  }

  route = {
    ...route,
    params: req.params,
  };

  if (env === 'development') {
    await esbuild.build({
      entryPoints: [clientPath('src', route)],
      outfile: clientPath('dist', route),
      format: 'esm',
      minify: env !== 'development',
      bundle: true,
    });
  }

  const module = await import(clientPath('dist', route));
  const script = await readFileSync(clientPath('dist', route)).toString();

  if (module.fetchModel) {
    fetchedData = await module.fetchModel(route);
  }

  route.title = route.title ? route.title : fetchedData.meta.title;

  const compiledTemplate = module.template(fetchedData);
  const template = await sanitizeTemplate(compiledTemplate);
  const ssrResult = await renderApp(route, template, script);
  let stream = await renderStream(ssrResult);
  stream = stream.replace(/<template shadowroot="open"><\/template>/g, '');
  res.status(200).send(stream);
};
