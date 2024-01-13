const Joi = require('joi');
const InvariantError = require('../response/exceptions/InvariantError');

class Validator {
  constructor(schema, isUnknown = false) {
    this.schema = schema;
    this.isUnknown = isUnknown;
  }

  validate(payload) {
    let object;
    if (this.isUnknown) {
      object = Joi.object(this.schema).unknown();
    } else {
      object = Joi.object(this.schema);
    }

    const validationResult = object.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = Validator;
