const regex = exports.regex = /^\$read(?:[._]*)?file(?:[._]*sync)?$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.value = function value(object, prop, stringprop) {
  if (!this.proxy.$stat.file) throw new Error('Read: I am not a file.');
  if (stringprop.includes('sync')) {
    return this._fs.readFileSync(this.proxy());
  } else {
    return new this._Promise((res, rej) => this._fs.readFile(this.proxy(), (err, data) => {
      if (err) return rej(err);
      return res(data);
    }));
  }
};
