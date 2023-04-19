import { installShimOnGlobal } from '../../shim/src/index.js';

installShimOnGlobal();

import chalk from 'chalk';
import express from 'express';
import { join, resolve } from 'path';
import compression from 'compression';
import fs from 'fs';
import http from 'http';
import https from 'https';
import cors from 'cors';
import bodyParser from 'body-parser';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import ssr from './middleware/ssr.js';
import apiRouter from './middleware/api.js';
import { config } from './config.js';

const app = express();
const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || config.port || '4443';
const protocol = process.env.PROTOCOL || 'HTTP';
const corsOptions = env === 'production' ? { origin: `${config.host}` } : {};
let server;

const clientRootPath = (filename) =>
  resolve(`${process.cwd()}../../client/dist/${filename}`);

if (protocol === 'HTTPS') {
  const sslOptions = {
    key: fs.readFileSync(join(process.cwd(), '.config', 'ssl', 'key.pem')),
    cert: fs.readFileSync(join(process.cwd(), '.config', 'ssl', 'cert.pem')),
    requestCert: false,
    rejectUnauthorized: false,
  };
  server = https.createServer(sslOptions, app);
} else {
  server = http.createServer(app);
}

app.use(cors(corsOptions));
app.use(bodyParser.json());

if (env === 'development') {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/');
    }, 10);
  });
  app.use(connectLiveReload());
}

if (env === 'production') {
  app.use(compression());
}

const staticOptions = {
  dotfiles: 'ignore',
  extensions: ['htm', 'html'],
  index: false,
  redirect: false,
};

app.use('/robots.txt', express.static(clientRootPath('/robots.txt')));

app.use(
  '/style.css',
  express.static(clientRootPath('/style.css'), {
    dotfiles: 'ignore',
    extensions: ['ttf'],
    index: false,
    redirect: false,
  })
);

app.get('/', ssr);
app.get('/post/:slug', ssr);
app.use('/api', apiRouter);

server.listen(port, () => {
  const addr = `${protocol === 'HTTPS' ? 'https' : 'http'}://localhost:${port}`;
  process.stdout.write(
    `\n [${new Date().toISOString()}] ${chalk.green(
      'Server running:'
    )} ${chalk.blue(addr)} \n`
  );
});

export default app;
