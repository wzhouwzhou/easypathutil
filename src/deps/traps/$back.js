const name = exports.name = '$back';

exports.condition = ({ stringprop }) => stringprop === name;
exports.value = function value() {
  return this.proxy.$_create(this.parts.slice(0, -1));
};
