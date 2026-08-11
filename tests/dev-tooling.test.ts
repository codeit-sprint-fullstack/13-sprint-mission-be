import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const packageJsonUrl = new URL('../package.json', import.meta.url);
const projectDirectory = fileURLToPath(new URL('..', import.meta.url));

test('개발 서버는 nodemon과 ts-node로 TypeScript 변경을 감시한다', async () => {
  const packageJson = JSON.parse(await readFile(packageJsonUrl, 'utf8')) as {
    scripts?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  assert.match(packageJson.scripts?.dev ?? '', /nodemon/);
  assert.match(packageJson.scripts?.dev ?? '', /ts-node/);
  assert.ok(packageJson.devDependencies?.nodemon);
  assert.ok(packageJson.devDependencies?.['ts-node']);

  const child = spawn(process.execPath, ['--loader', 'ts-node/esm', 'app.ts'], {
    cwd: projectDirectory,
    env: { ...process.env, PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', (chunk: string) => {
    output += chunk;
  });
  child.stderr.on('data', (chunk: string) => {
    output += chunk;
  });

  try {
    await new Promise<void>((resolve, reject) => {
      let settled = false;
      const settle = (callback: () => void) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        callback();
      };
      const checkStartup = () => {
        if (output.includes('서버가 http://localhost:0 에서 실행 중이에요!')) {
          settle(resolve);
        }
      };
      const timeout = setTimeout(
        () => settle(() => reject(new Error(`ts-node ESM startup timed out:\n${output}`))),
        10_000,
      );

      child.stdout.on('data', checkStartup);
      child.once('exit', (code) => {
        checkStartup();
        settle(() => reject(new Error(`ts-node ESM startup exited with code ${code}:\n${output}`)));
      });
    });
  } finally {
    child.kill('SIGTERM');
  }
});
