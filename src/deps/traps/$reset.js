const name = exports.name = '$reset';

exports.condition = ({ stringprop }) => stringprop === name;
exports.value = function value() {
  return new this.constructor(this.base, {
    JSON: this._JSON,
    path: this._path,
    fs: this._fs,
    Promise: this._Promise,
    readdir_filter: this.readdir_filter,
  });
};
