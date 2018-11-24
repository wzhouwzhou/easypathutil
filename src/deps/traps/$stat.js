const regex = exports.regex = /^\$stat([._]*sync)?(?:[._]*(?:legacy|number))?$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.value = function value(object, prop, stringprop) {
  const p = this._path.join(this.base, ...this.parts);
  if (stringprop.toLowerCase().includes('sync')) return this.read_dir.get_stat_sync(p, stringprop);
  return this.read_dir.get_stat(p, stringprop);
};
