import axios from 'axios';
import nock from 'nock';
import { test, expect } from '@playwright/test';

test('Create issue with missing title returns error (mocked)', async () => {
  const scope = nock('https://api.github.com')
    .post('/repos/test-owner/test-repo/issues', {
      title: '',
      body: 'Test Body',
    })
    .reply(422, {
      message: 'Validation Failed',
    });

  try {
    await axios.post('https://api.github.com/repos/test-owner/test-repo/issues', {
      title: '',
      body: 'Test Body',
    }, {
      headers: {
        Authorization: 'token fake-token',
        Accept: 'application/vnd.github.v3+json',
      },
    });
  } catch (err: any) {
    expect(err.response.status).toBe(422);
    expect(err.response.data.message).toContain('Validation Failed');
  }

  scope.done();
});
