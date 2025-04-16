import axios from 'axios';
import nock from 'nock';
import { test, expect } from '@playwright/test';

test('Create a new issue with title and body (mocked)', async () => {
  const scope = nock('https://api.github.com')
    .post('/repos/test-owner/test-repo/issues', {
      title: 'Test Issue Title',
      body: 'Test Issue Body',
    })
    .reply(201, {
      number: 123,
      title: 'Test Issue Title',
      body: 'Test Issue Body',
      state: 'open',
    });

  const res = await axios.post('https://api.github.com/repos/test-owner/test-repo/issues', {
    title: 'Test Issue Title',
    body: 'Test Issue Body',
  }, {
    headers: {
      Authorization: 'token fake-token',
      Accept: 'application/vnd.github.v3+json',
    },
  });

  expect(res.status).toBe(201);
  expect(res.data.title).toBe('Test Issue Title');
  expect(res.data.body).toBe('Test Issue Body');

  scope.done();
});
