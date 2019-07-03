exports.node_internal = true;
exports.condition = ({ prop }) => prop === Symbol.hasInstance;
exports.value = function value() {
  return obj => obj[Symbol.species] === this.constructor;
};
