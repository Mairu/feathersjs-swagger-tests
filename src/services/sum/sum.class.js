/* eslint-disable no-unused-vars */
exports.Sum = class Sum {
  constructor (options) {
    this.options = options || {};

    this.model = 'Test if something is given here';

    this.docs = {
      operations: {
        find: {
          description: 'Summarize the numbers',
          parameters: [
            {
              name: 'a',
              in: 'query',
              schema: {
                type: 'integer',
              }
            },
            {
              name: 'b',
              in: 'query',
              schema: {
                type: 'integer',
              }
            }
          ],
          'responses.200.content.application/json.schema': {
            type: 'object',
            properties: {
              sum: {
                type: 'integer',
              },
            }
          }
        }
      }
    };
  }



  async find (params) {
    let sum = 0;
    if (params.query.a) {
      sum += parseInt(params.query.a, 10);
    }
    if (params.query.b) {
      sum += parseInt(params.query.b, 10);
    }
    return { sum };
  }
};
