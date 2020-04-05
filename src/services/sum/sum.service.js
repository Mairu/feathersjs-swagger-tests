// Initializes the `sum` service on path `/sum`
const { Sum } = require('./sum.class');
const hooks = require('./sum.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/sum', new Sum(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('sum');

  service.hooks(hooks);
};
