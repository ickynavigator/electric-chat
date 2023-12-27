import { spawn } from 'child_process';
import path from 'path';

const defaultEnvFile = path.join(__dirname, '..', '.env.docker.default');
const envFile = path.join(__dirname, '..', '.env');
const composeFile = path.join(
  __dirname,
  'docker',
  'compose',
  'docker-compose.yaml',
);

export function dockerCompose(
  command: string,
  userArgs: string[],
  callback?: (code: number | null, signal: NodeJS.Signals | null) => void,
) {
  const args = [
    'compose',
    '--ansi',
    'always',
    '--env-file',
    defaultEnvFile,
    '--env-file',
    envFile,
    '-f',
    composeFile,
    command,
    ...userArgs,
  ];
  const proc = spawn('docker', args, { stdio: 'inherit' });
  if (callback) {
    proc.on('exit', callback);
  }
}

export function errorMsg(err: Error | string) {
  console.error(`\x1b[31m\n${err}\n\x1b[0m`);
}
