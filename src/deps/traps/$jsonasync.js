const regex = exports.regex = /^\$(?:to[._]*)?json(?:[._]*)?async$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.value = function value() {
  const file = this.proxy.$readfilesync;
  return this._JSON.parse(file);
};
