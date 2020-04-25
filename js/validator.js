const Validator = {
  _validators: {},
  registered: function (name) {
    return typeof this._validators[name] !== 'undefined';
  },
  validate: function ({ name, value }) {
    if (this._validators[name]) {
      return this._validators[name](value);
    }

    return false;
  },
  register: function ({ name, fn }) {
    if (typeof name === 'string' && typeof fn === 'function') {
      this._validators[name] = fn;
    }
  }
};
