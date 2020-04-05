// Initializes the `seqtest` service on path `/seqtest`
const { Seqtest } = require('./seqtest.class');
const createModel = require('../../models/seqtest.model');
const hooks = require('./seqtest.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/seqtest', new Seqtest(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('seqtest');

  service.hooks(hooks);
};
