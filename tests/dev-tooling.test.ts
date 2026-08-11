import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const packageJsonUrl = new URL('../package.json', import.meta.url);

test('개발 서버는 nodemon과 ts-node로 TypeScript 변경을 감시한다', async () => {
  const packageJson = JSON.parse(await readFile(packageJsonUrl, 'utf8')) as {
    scripts?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  assert.match(packageJson.scripts?.dev ?? '', /nodemon/);
  assert.match(packageJson.scripts?.dev ?? '', /ts-node/);
  assert.ok(packageJson.devDependencies?.nodemon);
  assert.ok(packageJson.devDependencies?.['ts-node']);
});
