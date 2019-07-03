const { inspect } = require('util');
exports.condition = ({ prop }) => prop === 'valueOf' ||
  prop === Symbol.toPrimitive || prop === inspect.custom || prop === Symbol.for('nodejs.util.inspect.custom');
exports.node_internal = true;
exports.value = function value() {
  return () => `Path [${this.proxy()}]`;
};
