const Joi = require('joi');
const InvariantError = require('../response/exceptions/InvariantError');

class Validator {
  constructor(schema) {
    this.schema = schema;
  }

  validate(payload) {
    const validationResult = Joi.object(this.schema).validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = Validator;
