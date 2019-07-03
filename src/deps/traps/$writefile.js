const regex = exports.regex = /^\$write(?:[._]*)?file(?:[._]*sync)?$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.dependencies = ['$mkdir'];
exports.value = function value(object, prop, stringprop) {
  if (stringprop.toLowerCase().includes('sync')) {
    return function write_sync(content, opts = { encoding: 'utf-8' }) {

      this.proxy.$back.$mkdir_sync_func();
      this._fs.writeFileSync(this.proxy(), content, opts);
      return true;
    }.bind(this);
  } else {
    return function write(content, opts = { encoding: 'utf-8' }) {
      return new Promise(async(res, rej) => {
        await this.proxy.$mkdir_func();
        this._fs.writeFile(this.proxy(), content, opts, err => err ? rej(err) : res(true));
        res(true);
      });
    }.bind(this);
  }
};
