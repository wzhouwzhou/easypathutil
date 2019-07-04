const regex = exports.regex = /^\$(?:to[._]*)?json(?:[._]*sync)?$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.dependencies = ['$readfile'];
exports.value = function value() {
  console.log('$json called', this.proxy())
  const file = this.proxy.$readfilesync;
  return this.JSON.parse(file);
};
