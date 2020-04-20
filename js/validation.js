class Validation {
  constructor(fields, rules, messages) {
    this._fields = fields;
    this._messages = messages;
    this._errors = {};
    this._rules = {};

    for (const name in rules) {
      this._rules[name] = Array.isArray(rules[name]) ? rules[name] : [rules[name]];
    }
  }

  validate() {
    for (const fieldName in this._fields) {
      if (this._rules[fieldName]) {
        const validators = this._rules[fieldName];

        for (const name of validators) {
          if (Validator.registered(name) && !Validator.validate({ name, value: this._fields[fieldName] })) {
            this._errors[fieldName] = this._messages[fieldName];
          }
        }
      }
    }

    return Object.keys(this._errors) === 0;
  }

  errors() {
    return this._errors;
  }
}
