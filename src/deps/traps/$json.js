const regex = exports.regex = /^\$(?:to[._]*)?json$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.value = function value() {
  const file = this.proxy.$readfilesync.toString();
  return this._JSON.parse(file);
};
