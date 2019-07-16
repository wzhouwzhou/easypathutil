const regex = exports.regex = /^\$rm(?:[._]*sync)(?:[._]*func)?$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.dependencies = ['$stat'];
exports.value = function value(object, prop, stringprop) {
  if (!stringprop.toLowerCase().includes('func')) return this.proxy[`${stringprop}_func`](this.proxy());

  const _fs = this.fs;
  if (stringprop.toLowerCase().includes('sync')) {
    return function rmSync(path = Function[Symbol.hasInstance](this) && typeof this() === 'string' ? this() : this.proxy()) {
      if (!this.read_dir.get_stat_sync(path).file) {
        throw new Error(`Read: I am not a file. (Tried to rmdir ${path} unsuccessfully: not implemented.)`);
      }
      _fs.unlinkSync(path);
      return true;
    }.bind(this);
  } else {
    return function rm(path = Function[Symbol.hasInstance](this) && typeof this() === 'string' ? this() : this.proxy()) {
      return this.Promise.resolve((async() => {
        if (!(await this.read_dir.get_stat_sync(path)).file) {
          throw new Error(`Read: I am not a file. (Tried to rmdir ${path} unsuccessfully: not implemented.)`);
        }
        return new this.Promise((res, rej) => _fs.unlink(path, (err, data) => {
          if (err) return rej(err);
          return res(data);
        }));
      })());
    }.bind(this);
  }
};
