const regex = exports.regex = /^\$rm(?:[._]*sync)?(?:[._]*func)?$/i;
const gen_sync_filter = folders => function sync_filter(_path) {
  const is_dir = this.get_stat_sync(_path).directory; // eslint-disable-line no-invalid-this
  if (is_dir) folders.push(_path);
  return is_dir;
};
exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.dependencies = ['$stat'];
exports.value = function value(object, prop, stringprop) {
  const lower = stringprop.toLowerCase();
  if (!lower.includes('func')) {
    if (lower.includes('sync')) return !Error[Symbol.hasInstance](this.proxy.$rm_sync_func(this.proxy()));
    return Promise.resolve(this.proxy.$rm_func(this.proxy())).then(e => !Error[Symbol.hasInstance](e));
  }

  const _fs = this.fs;
  if (stringprop.toLowerCase().includes('sync')) {
    return function rmSync(path = Function[Symbol.hasInstance](this) && typeof this() === 'string' ? this() : this.proxy()) {
      try {
        if (this.read_dir.get_stat_sync(path).folder) {
          let folders = [];
          const files = this.read_dir.sync(path, gen_sync_filter(folders));
          for (const file of files) _fs.unlinkSync(file);
          for (let folder, i = folders.length; i && (folder = folders[i--]);) _fs.rmdirSync(folder);
          _fs.rmdirSync(path);
          return true;
        } else {
          return _fs.unlinkSync(path) || true;
        }
      } catch (err) {
        return err;
      }
    }.bind(this);
  } else {
    return function rm(path = Function[Symbol.hasInstance](this) && typeof this() === 'string' ? this() : this.proxy()) {
      return this.Promise.resolve((async() => {
        if ((await this.read_dir.get_stat_sync(path)).folder) {
          let folders = [];
          const files = this.read_dir.sync(path, gen_sync_filter(folders));
          const promises = new Array(files.length);
          for (let i = files.length; i--;) {
            promises[i] = new Promise((res, rej) => _fs.unlink(files[i], err => err ? rej(err) : res(!0)));
          }
          await Promise.all(promises);
          for (let i = folders.length; i--;) {
            // Folders must be removed in order
            // eslint-disable-next-line no-await-in-loop
            await new Promise((res, rej) => _fs.rmdir(folders[i], err => err ? rej(err) : res(!0)));
          }
          await new Promise((res, rej) => _fs.rmdir(path, err => err ? rej(err) : res(!0)));
          return true;
        } else {
          return new this.Promise((res, rej) => _fs.unlink(path, (err, data) => {
            if (err) return rej(err);
            return res(data || !0);
          }));
        }
      })());
    }.bind(this);
  }
};
