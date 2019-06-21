const regex = exports.regex = /^\$(?:to[._]*)?json(?:[._]*sync)?$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.dependencies = ['$readfile'];
exports.value = function value() {
  const file = this.proxy.$readfilesync;
  return this._JSON.parse(file);
};
