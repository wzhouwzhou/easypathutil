const name = exports.name = '$back';

exports.condition = ({ stringprop }) => stringprop === name;
exports.dependencies = ['$_create'];
exports.value = function value() {
  if (this.parts.length === 0) return this.proxy.$_create([], this.path.dirname(this.base));
  return this.proxy.$_create(this.parts.slice(0, -1));
};
