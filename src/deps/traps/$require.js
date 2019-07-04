const name = exports.name = '$require';
const regex = exports.regex = /^\$require(?:[._]*default)?$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.value = function value(object, prop) {
  const required = require(this.path.join(this.base, ...this.parts));
  if (prop.toString().toLowerCase() === name) {
    return required && required.__esModule ? required.default : required;
  } else {
    return (required && required.default) || required;
  }
};
