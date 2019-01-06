const regex = exports.regex = /^\$read(?:[._]*)?file(?:[._]*)?stream$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.value = function value() {
  if (!this.proxy.$statsync.file) throw new Error('Read: I am not a file.');
  return this._fs.createReadStream(this.proxy(), this.readFileStreamOptions || {});
};
