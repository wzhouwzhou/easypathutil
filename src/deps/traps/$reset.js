const name = exports.name = '$reset';

exports.condition = ({ stringprop }) => stringprop === name;
exports.dependencies = ['$_create'];
exports.value = function value() {
  return this.proxy.$_create();
};
