const app = require('../../src/app');

describe('\'messages\' service', () => {
  it('registered the service', async () => {
    const service = app.service('messages');
    service.hooks({ before: { all: [() => console.log(1)] }});
    service.hooks({ before: { all: [() => console.log(2)] }});
    expect(service).toBeTruthy();

    await service.find();
  });
});
