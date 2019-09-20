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
