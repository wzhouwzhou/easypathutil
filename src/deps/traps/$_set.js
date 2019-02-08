/* eslint-disable no-return-assign */
const name = exports.name = '$_set';

exports.condition = ({ stringprop }) => stringprop === name;
exports.value = function value() {
  return function _set(prop, val) {
    this.proxy.$_props[prop] = val;
    return this.proxy;
  }.bind(this);
};
