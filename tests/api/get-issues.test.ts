import axios from 'axios';
import { expect, test } from '@playwright/test';

test('Retrieve list of issues from public repo', async () => {
  const res = await axios.get('https://api.github.com/repos/microsoft/vscode/issues');
  expect(res.status).toBe(200);
  expect(Array.isArray(res.data)).toBe(true);
});
