const regex = exports.regex = /^\$read(?:[._]*)?file(?:[._]*)?stream$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.dependencies = ['$stat'];
exports.value = function value() {
  if (!this.proxy.$statsync.file) throw new Error(`Read: I am not a file. (Tried to access ${this.proxy()} unsuccessfully.)`);
  return this.fs.createReadStream(this.proxy(), this.readFileStreamOptions || {});
};
