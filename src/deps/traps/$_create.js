/* eslint-disable no-return-assign, no-sequences */
const name = exports.name = '$_create';

exports.condition = ({ stringprop }) => stringprop === name;
exports.value = function value() {
  return function _create(parts = [], new_base = this.base, use_cache = this.use_cache) {
    if (!use_cache) {
      return new this.constructor(new_base, this._properties.reduce((obj, p) => (obj[p] = this[p], obj), {}), parts);
    }
    const id = [new_base, ...parts].join(process.pid);
    // CacheChecking: if (this.constructor.cache[id]) console.log('Using cache', this.use_cache); else console.log(`No cache for id ${id}`);
    return this.constructor.cache[id] || (this.constructor.cache[id] = new this.constructor(new_base,
      this._properties.reduce((obj, p) => (obj[p] = this[p], obj), {}), parts));
  }.bind(this);
};
