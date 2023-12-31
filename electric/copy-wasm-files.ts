import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { errorMsg } from './utils';

// Copies the wasm files needed for wa-sqlite
// from `/node_modules/wa-sqlite/dist` into `public`
const waSqlitePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'wa-sqlite',
  'dist',
);
const publicFolder = path.join(__dirname, '..', 'app', 'public');

const mjsFileName = 'wa-sqlite-async.mjs';
const mjsFile = path.join(waSqlitePath, mjsFileName);
const mjsDest = path.join(publicFolder, mjsFileName);

const wasmFileName = 'wa-sqlite-async.wasm';
const wasmFile = path.join(waSqlitePath, wasmFileName);
const wasmDest = path.join(publicFolder, wasmFileName);

try {
  copyFile(mjsFile, mjsDest);
  copyFile(wasmFile, wasmDest);
} catch {
  errorMsg(
    `Could not copy wasm files required for wa-sqlite. Did you forget to run 'yarn install' ?`,
  );
}
