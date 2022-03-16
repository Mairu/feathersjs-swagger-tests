const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');

module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());

  authentication.docs = {
    idNames: {
      remove: 'token',
    },
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
