exports.condition = ({ prop }) => prop === Symbol.toStringTag;

exports.node_internal = true;
exports.value = function value() {
  return `Path [${this.proxy()}]`;
};
