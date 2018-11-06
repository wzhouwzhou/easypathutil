const regex = exports.regex = /^\$read(?:[._]*)?dir(?:[._]*sync)?$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.value = function value(object, prop, stringprop) {
  if (stringprop.includes('sync')) {
    return this.read_dir.sync(this.proxy());
  } else {
    return this.read_dir.parallel(this.proxy());
  }
};
