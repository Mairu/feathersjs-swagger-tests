// Initializes the `users` service on path `/users`
const createService = require('feathers-nedb');
const createModel = require('../../../models/posts.model');
const hooks = require('./posts.hooks');

const schema = {
  // !<DEFAULT> code: schema_header
  title: 'Post',
  description: 'A post',
  // !end
  // !code: schema_definitions // !end
  type: 'object',
  // Required fields.
  required: [
    // !code: schema_required
    'userId',
    'content',
    // !end
  ],
  // Fields in the model.
  properties: {
    // !code: schema_properties
    userId: { type: 'string' },
    content: { type: 'string' },
    // !end
  },
  // !code: schema_more // !end
  example: {
    content: 'some content',
  }
};

const responseSchema = {
  ...schema,
  properties: {
    _id: { type: 'string' },
    ...schema.properties,
    userId: { type: 'string' },
  },
  example: {
    _id: '_dgfd345fsdg',
    ...schema.example,
    userId: '_dg345dfgdfgfd',
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
    securities: ['all'],
    // setup the path param
    pathParams: {
      userId: {
        name: 'userId',
        description: 'userId as path param',
        in: 'path',
        schema: {
          type: 'string',
        },
        required: true,
      }
    },
    // use custom model name because of path param
    model: 'post',
    // if an extra group should be used, add a custom tag
    tag: 'user posts',
    description: 'the description for the user posts service'
  };

  service.model = schema;
  service.modelResponse = responseSchema;

  const path = '/users/:userId/posts';

  app.use(path, service);

  // Get our initialized service so that we can register hooks

  app.service(path).hooks(hooks);
};
