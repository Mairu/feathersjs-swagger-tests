const messages = require('./messages/messages.service.js');
const users = require('./users/users.service.js');
const sum = require('./sum/sum.service.js');
const seqtest = require('./seqtest/seqtest.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(sum);
  app.configure(messages);
  app.configure(users);
  app.configure(seqtest);
};
