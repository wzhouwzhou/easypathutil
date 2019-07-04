const regex = exports.regex = /^\$ma?ke?(?:[._]*)?dir(?:[._]*sync)?(?:[._]*func)?$/i;
let gte_v10_12, default_options;
exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.value = function value(object, prop, stringprop) {
  if (gte_v10_12 === undefined) {
    const version = process.versions && typeof process.versions.node && process.versions.node;
    // If using some non-standard version of node, better to stay on the safe side.
    gte_v10_12 = (() => {
      if (version.startsWith('10.12')) return true;
      const [ma, mi] = version.split('.');
      if (+ma > 10) return true;
      if (+ma < 10) return false;
      if (+mi < 12) return false;
      return true;
    })();
    default_options = { gte_v10_12, recursive: true };
  }
  if (stringprop.includes('sync')) {
    if (stringprop.includes('func')) {
      return function mkdir_sync(options = default_options) {
        return this.read_dir.mkdir_sync(this.proxy(), options);
      }.bind(this);
    }
    return this.proxy.$mkdir_sync_func(default_options);
  } else {
    if (stringprop.includes('func')) {
      return function mkdir(options = default_options) {
        return new this.Promise((res, rej) => this.read_dir.mkdir_cb(this.proxy(), options, (err, path) => {
          if (err) return rej(err);
          return res(path);
        }));
      }.bind(this);
    }
    return this.proxy.$mkdir_func(default_options);
  }
};
