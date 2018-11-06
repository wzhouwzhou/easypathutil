const { inspect } = require('util');

const name = exports.name = '$inspect';
exports.condition = ({ prop }) =>
  prop === Symbol.toPrimitive ||
  prop === Symbol.toStringTag ||
  prop === name ||
  (inspect && prop === inspect.custom)
;

exports.value = function value() {
  return `Path [${this.proxy()}]`;
};
