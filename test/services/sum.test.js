const app = require('../../src/app');

describe('\'sum\' service', () => {
  it('registered the service', () => {
    const service = app.service('sum');
    expect(service).toBeTruthy();
  });
});
