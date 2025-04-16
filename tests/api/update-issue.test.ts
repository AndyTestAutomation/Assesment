import axios from 'axios';
import nock from 'nock';
import { test, expect } from '@playwright/test';

test('Close an issue (mocked)', async () => {
  const issueNumber = 123;

  const scope = nock('https://api.github.com')
    .patch(`/repos/test-owner/test-repo/issues/${issueNumber}`, { state: 'closed' })
    .reply(200, {
      number: issueNumber,
      state: 'closed',
    });

  const res = await axios.patch(`https://api.github.com/repos/test-owner/test-repo/issues/${issueNumber}`, {
    state: 'closed',
  }, {
    headers: {
      Authorization: 'token fake-token',
      Accept: 'application/vnd.github.v3+json',
    },
  });

  expect(res.status).toBe(200);
  expect(res.data.state).toBe('closed');

  scope.done();
});
