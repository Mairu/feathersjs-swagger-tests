const { authenticate } = require('@feathersjs/authentication').hooks;

// A hook that updates `data` with the route parameter
function mapUserIdToData(context) {
  if(context.data && context.params.route.userId) {
    context.data.userId = context.params.route.userId;
  }
}

// A hook that updates `data` with the route parameter
function mapUserIdToQuery(context) {
  if(context.params.route.userId) {
    context.params.query.userId = context.params.route.userId;
  }
}

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt'), mapUserIdToQuery ],
    get: [ authenticate('jwt'), mapUserIdToQuery ],
    create: [ mapUserIdToData ],
    update: [ authenticate('jwt'), mapUserIdToData ],
    patch: [ authenticate('jwt'), mapUserIdToData ],
    remove: [ authenticate('jwt'), mapUserIdToQuery ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
