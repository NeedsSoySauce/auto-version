import { test } from '@jest/globals';
import * as cp from 'child_process';
import * as path from 'path';
import * as process from 'process';

test('Runs without building', () => {
  process.env.INPUT_MAJOR = '[MAJOR]';
  process.env.INPUT_MINOR = '[MINOR]';
  process.env.INPUT_PATCH = '[PATCH]';
  const np = process.execPath;
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  };
  cp.execFileSync(np, [ip], options).toString();
});
