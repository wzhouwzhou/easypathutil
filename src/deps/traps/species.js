exports.condition = ({ prop }) => prop === Symbol.species;
exports.value = function value() {
  return this.constructor;
};
