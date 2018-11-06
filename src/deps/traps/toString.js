const name = exports.name = 'toString';

exports.condition = ({ prop }) => prop === name;
exports.value = function value() {
  return this.proxy();
};
