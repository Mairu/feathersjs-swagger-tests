const path = require('path');
const swagger = require('feathers-swagger');

module.exports = (app) => {
  app.get('/docs/swagger-ui-apikey-auth-form.js', function (req, res) {
    res.sendFile(require.resolve('@mairu/swagger-ui-apikey-auth-form/dist/swagger-ui-apikey-auth-form'));
  });

  app.configure(swagger({
    specs: {
      info: {
        title: 'Testing stuff with feathers',
        version: '0.0.1',
      },
      paths: {
        '/authentication': {
          post: {
            parameters: [
              {
                in: 'body',
                name: 'body',
                required: true,
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    password: { type: 'string' },
                  }
                }
              }
            ],
            responses: {
              '200': {
                description: 'authenticated',
                schema: {
                  type: 'object',
                  properties: {
                    username: 'string',
                    password: 'string',
                  }
                }
              },
              '401': {
                description: 'not authenticated'
              },
              '500': {
                description: 'general error'
              }
            },
            description: 'Authenticate a user and create a jwt token.',
            summary: '',
            tags: [
              'authentication'
            ],
            consumes: [
              'application/json'
            ],
            produces: [
              'application/json'
            ],
            security: []
          }
        },
      },
      schemes: ['http', 'https']
    },
    openApiVersion: 3,
    uiIndex: path.join(__dirname, '..', 'public', 'docs', 'index.html'),
    docsJsonPath: '/docs/swagger.json',
    defaults: {
      schemasGenerator(service, model, modelName) {
        // can't do this
        if (model === 'authentication') return {};
        return {
          [model]: service.model,
          [`${model}_list`]: {
            title: `${modelName} list`,
            type: 'array',
            items: { $ref: `#/components/schemas/${model}` }
          },
        };
      }
    }
  }));
};
