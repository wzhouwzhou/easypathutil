/* eslint-disable no-return-assign */
const name = exports.name = '$_props';

exports.condition = ({ stringprop }) => stringprop === name;
exports.value = function value() {
  const properties = ['base', 'parts', 'JSON', 'path', 'fs', 'Promise', 'readdir_filter'];
  const _export = {};
  for (const prop of properties) {
    Object.defineProperty(_export, prop, { enumerable: 1,
      get: function get() { return this[prop]; }.bind(this),
      set: function set(newval) { return this[prop] = newval; }.bind(this),
    });
  }
  return _export;
};
