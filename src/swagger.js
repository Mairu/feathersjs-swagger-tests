// const path = require('path');
const swagger = require('feathers-swagger');
const { Model: SequelizeModel } = require('sequelize');
const NeDBModel = require('nedb');

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
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer'
          }
        }
      },
      security: [
        { BearerAuth: [] }
      ]
    },
    openApiVersion: 3,
    //uiIndex: path.join(__dirname, '..', 'public', 'docs', 'index.html'),
    uiIndex: true,
    docsJsonPath: '/docs/swagger.json',
    defaults: {
      getOperationsRefs(model, service) {
        const refs = {};

        if (service.modelResponse) {
          refs.createResponse = `${model}_response`;
        }

        return refs;
      },
      schemasGenerator(service, model, modelName) {
        if (service.options && service.options.Model) {
          if (service.options.Model && typeof service.options.Model.sequelize === 'function') {
            console.log('seq', model);
          } else if (service.options.Model instanceof NeDBModel) {
            console.log('nedb', model);
          }
        }

        if (!service.options || !service.options.Model || !(service.options.Model instanceof SequelizeModel)) {
          console.log(`Service of model ${model} is sequelize`);
        }

        if (!service.options || !service.options.Model || !(service.options.Model instanceof NeDBModel)) {
          return {};
        }

        // can't do this
        if (model === 'authentication') return {};

        const schemas =  {
          [model]: service.model,
          [`${model}_list`]: {
            title: `${modelName} list`,
            type: 'array',
            items: { $ref: `#/components/schemas/${model}` }
          },
        };

        if (service.modelResponse) {
          schemas[`${model}_response`] = service.modelResponse;
        }

        return schemas;
      }
    }
  }));
};
