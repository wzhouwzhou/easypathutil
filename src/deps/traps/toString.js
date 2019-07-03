const name = exports.name = 'toString';
exports.node_internal = true;
exports.condition = ({ prop }) => prop === name;
exports.value = function value() {
  return () => this.proxy();
};
