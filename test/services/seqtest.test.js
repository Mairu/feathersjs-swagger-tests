const app = require('../../src/app');

describe('\'seqtest\' service', () => {
  it('registered the service', () => {
    const service = app.service('seqtest');
    expect(service).toBeTruthy();
  });
});
