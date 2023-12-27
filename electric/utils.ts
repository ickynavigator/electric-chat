import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import { env } from '../env/server';

export async function findFirstMatchInFile(
  regex: RegExp,
  file: string,
  notFoundError: string,
) {
  const content = await fs.readFile(file, 'utf8');
  const res = content.match(regex);
  if (res == null || res[1] == null) {
    console.error(notFoundError);
    process.exit(1);
  }
  return res[1];
}

export async function fetchConfiguredElectricPort() {
  return env.ELECTRIC_PORT;
}

export async function fetchConfiguredElectricProxyPort() {
  return env.ELECTRIC_PROXY_PORT;
}

const envrcFile = path.join(__dirname, '..', '.env');
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
    envrcFile,
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
