const name = exports.name = 'new';
const regex = exports.regex = /^\$new(?:[._]*default)?$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.value = function value(object, prop) {
  if (prop.toString().toLowerCase() === name) {
    return new this.proxy.$require;
  } else {
    return new this.proxy.$require_default;
  }
};
