// Initializes the `users` service on path `/users`
const createService = require('feathers-nedb');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

const schema = {
  // !<DEFAULT> code: schema_header
  title: 'User',
  description: 'User database.',
  // !end
  // !code: schema_definitions // !end
  type: 'object',
  // Required fields.
  required: [
    // !code: schema_required
    'email',
    'firstName',
    'lastName',
    'password'
    // !end
  ],
  // Fields in the model.
  properties: {
    // !code: schema_properties
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    password: { type: 'string' },
    // !end
  },
  // !code: schema_more // !end
  example: {
    email: 'abc@def.com',
    fistName: 'hans',
    lastName: 'muller',
    password: 'secure-hash'
  }
};

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  const service = createService(options);

  service.docs = {
    schema,
    securities: ['all']
  };

  app.use('/users', service);

  // Get our initialized service so that we can register hooks

  app.service('users').hooks(hooks);
};
