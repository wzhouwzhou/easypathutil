const name = exports.name = '$back';

exports.condition = ({ stringprop }) => stringprop === name;
exports.value = function value() {
  if (this.parts.length === 0) return this.proxy.$_create([], this._path.dirname(this.base));
  return this.proxy.$_create(this.parts.slice(0, -1));
};
