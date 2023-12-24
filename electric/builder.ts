import { spawn } from 'child_process';
import { BuildOptions, build, serve } from 'esbuild';
import inlineImage from 'esbuild-plugin-inline-image';
import fs from 'fs-extra';
import { IncomingMessage, ServerResponse, createServer, request } from 'http';
import { env } from '../env/server';

const shouldMinify = env.NODE_ENV === 'production';
const shouldServe = env.SERVE === 'true';

const getPlatformStartCommand = (platform: string) => {
  const op = {
    darwin: ['open'],
    linux: ['xdg-open'],
    win32: ['cmd', '/c', 'start'],
  } as const;

  const isValidPlatform = (platform: string): platform is keyof typeof op => {
    const validPlatforms: string[] = ['darwin', 'linux', 'win32'];

    return validPlatforms.includes(platform);
  };

  if (!isValidPlatform(platform)) {
    console.error(`Unsupported platform: ${platform}`);
    return op.darwin;
  }

  return op[platform];
};

// https://github.com/evanw/esbuild/issues/802#issuecomment-819578182
const liveServer = (buildOpts: BuildOptions) => {
  type Client = ServerResponse<IncomingMessage> & { req: IncomingMessage };
  const clients: Client[] = [];

  build({
    ...buildOpts,
    banner: {
      js: ' (() => new EventSource("/esbuild").onmessage = () => location.reload())();',
    },
    watch: {
      onRebuild(error, result) {
        clients.forEach(res => res.write('data: update\n\n'));
        clients.length = 0;
        console.log(error ? error : '...');
      },
    },
  }).catch(() => process.exit(1));

  serve({ servedir: '../../dist' }, {}).then(serveResult => {
    createServer((req, res) => {
      const { url, method, headers } = req;

      if (!url) return;

      if (url === '/esbuild') {
        return clients.push(
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          }),
        );
      }

      const path = url.split('/').pop()?.indexOf('.') ? url : `/index.html`; //for PWA with router
      req.pipe(
        request(
          {
            hostname: '0.0.0.0',
            port: serveResult.port,
            path,
            method,
            headers,
          },
          prxRes => {
            res.writeHead(prxRes.statusCode || 200, prxRes.headers);
            prxRes.pipe(res, { end: true });
          },
        ),
        { end: true },
      );
    }).listen(3001);

    setTimeout(() => {
      const command = getPlatformStartCommand(process.platform);

      const url = 'http://localhost:3001';
      if (clients.length === 0)
        spawn(command[0], [...[...command.slice(1)], url]);

      console.info(`Your app is running at ${url}`);
    }, 500); // open the default browser only if it is not opened yet
  });
};

/**
 * ESBuild Params
 * @link https://esbuild.github.io/api/#build-api
 */
const buildParams: BuildOptions = {
  color: true,
  entryPoints: ['../web/index.tsx'],
  loader: { '.ts': 'tsx' },
  outdir: 'dist',
  minify: shouldMinify,
  format: 'cjs',
  bundle: true,
  sourcemap: true,
  logLevel: 'error',
  incremental: true,
  define: {
    __DEBUG_MODE__: JSON.stringify(env.DEBUG_MODE === 'true'),
    __ELECTRIC_URL__: env.ELECTRIC_URL,
  },
  external: ['fs', 'path'],
  plugins: [inlineImage()],
};

(async () => {
  fs.removeSync('../../dist');
  fs.copySync('../../public', '../../dist');

  if (shouldServe) {
    liveServer(buildParams);
  } else {
    await build(buildParams);

    process.exit(0);
  }
})();
