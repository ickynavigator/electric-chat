// npx electric-sql generate --service http://localhost:5133 --proxy postgresql://prisma:proxy_password@localhost:65432/electric

import { spawn } from 'child_process';
import path from 'path';
import { env } from '../env/server';
import { errorMsg } from './utils';

const service = 'http://localhost:5133';
const proxyUrl = env.DATABASE_URL;
const outDir = path.join(__dirname, '..', 'app', 'src', 'generated');

const args = [
  'electric-sql',
  'generate',
  '--service',
  service,
  '--proxy',
  proxyUrl,
  '--out',
  outDir,
];

args.push(...process.argv.slice(2));

const proc = spawn('npx', args, {
  stdio: ['inherit', 'pipe', 'inherit'],
  shell: process.platform == 'win32',
});

proc.stdout.on('data', data => {
  process.stdout.write(data);
});

proc.on('exit', code => {
  if (code === 0) {
    console.log('⚡️ Client Generated.');
  } else {
    errorMsg(`Failed to generate. Exit code: ${code}`);
  }
});
