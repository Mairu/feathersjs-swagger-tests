const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');

module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  /*
HTTP Status 201
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJpYXQiOjE1Njg4Nzc4NjUsImV4cCI6MTU2ODk2NDI2NSwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoidjVjM3gzcTB0SHphQm9uMSIsImp0aSI6IjEzNWRjOTdiLTllNTUtNDIxZi04MWYyLThmODU3MzY0NTFjNCJ9.rvznyTXgdu_hakisCFISwRpyhNcCe26q3pq-lJZXx3M",
  "authentication": {
    "strategy": "local"
  },
  "user": {
    "email": "a@b.de",
    "_id": "v5c3x3q0tHzaBon1"
  }
}


DELETE for remove of token?
   */
  authentication.docs = {
    schema: {
      type: 'object',
      properties: {
        strategy: { type: 'string' },
        email:  { type: 'string' },
        password:  { type: 'string' },
      }
    },
    operations: {
      create: {
        description: 'Authenticate a user and create a jwt token.',
      }
    }
  };

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
