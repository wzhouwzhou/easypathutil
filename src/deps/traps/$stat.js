const regex = exports.regex = /^\$stat(?:[._]*(?:legacy|number))?$/i;

exports.condition = ({ stringprop }) => regex.test(stringprop);
exports.value = function value(object, prop, stringprop) {
  const p = this._path.join(this.base, ...this.parts);
  return this.read_dir.get_stat(p, stringprop, this._fs);
};
