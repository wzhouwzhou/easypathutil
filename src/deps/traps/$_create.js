const name = exports.name = '$_create';

exports.condition = ({ stringprop }) => stringprop === name;
exports.value = function value() {
  return (function(parts) {
    return new this.constructor(this.base, this._properties.reduce((obj, p) => (obj[p] = this[p], obj), {}), parts);
  }).bind(this);
};
