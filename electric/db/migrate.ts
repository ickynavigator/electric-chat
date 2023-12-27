import { spawn } from 'child_process';
import path from 'path';
import process from 'process';
import { errorMsg } from '../utils';
import { DATABASE_URL, PUBLIC_DATABASE_URL } from './utils';

console.info(`Connecting to proxy at ${PUBLIC_DATABASE_URL}`);

const migrationsDir = path.join(__dirname, 'migrations');

const args = [
  'pg-migrations',
  'apply',
  '--database',
  DATABASE_URL,
  '--directory',
  migrationsDir,
];
const proc = spawn('npx', args, {
  stdio: ['inherit', 'pipe', 'inherit'],
  shell: process.platform == 'win32',
});

let newMigrationsApplied = true;

proc.stdout.on('data', data => {
  if (data.toString().trim() === 'No migrations required') {
    newMigrationsApplied = false;
  } else {
    process.stdout.write(data);
  }
});

proc.on('exit', code => {
  if (code === 0) {
    if (newMigrationsApplied) {
      console.log('⚡️ Database migrated.');
    } else {
      console.log('⚡ Database already up to date.');
    }
  } else {
    errorMsg(`Failed to connect to the DB. Exit code: ${code}`);
  }
});
