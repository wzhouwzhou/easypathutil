/* eslint-disable no-inline-comments */ //#Todo #HelpWanted : Generate proper documentation for parameters #//
'use strict';
Reflect.defineProperty(exports, '__esModule', { value: true });

const { traps: { has, get } } = require('../deps');
const ReadHelper = require('./ReadHelper').default;

const _resolve = (rel, path, n, p = Error.prepareStackTrace) => {
  Error.prepareStackTrace = (_, $) => $;
  const { stack: [,,, s, s2] } = Error();
  Error.prepareStackTrace = p;
  return path.resolve(path.dirname(n ? s2.getFileName() : s.getFileName()) || process.cwd(), rel);
};

function PathBuilder(base = process.cwd(), {
  JSON = global.JSON, // JSON libraries to use.
  path = require('path'), // Path library to use. Not recommended to change from the default.
  fs = require('fs'), // Fs library to use
  Promise = global.Promise, // Promise library to use
  readdir_filter = null,
  filter = null, // Filters for $read_dir related traps
  n = null, // Automatically set to 1 if creating a new instance of PathBuilder to bypass extra stack call
  rel = false, // Specify an override for the relative path instead of automatically determining and/or using base.
} = {}, parts = []) {
  const opts = { JSON, path, fs, Promise, readdir_filter, filter, n, rel };
  if (!(this instanceof PathBuilder)) return new PathBuilder(base, { JSON, path, fs, Promise, readdir_filter, filter, n: 1, rel }, parts);
  this.base = PathBuilder.construct_base(path.normalize(base), opts);
  this.parts = parts;
  this._JSON = JSON; this._path = path; this._fs = fs; this._Promise = Promise; // Assign libraries to underscored private property
  this._readdir_filter = readdir_filter || filter;
  this.read_dir = new ReadHelper(this, opts);

  // Perform basic checks on potentially user-defined functions
  const empty = ['JSON', 'path', 'fs'].find(e => typeof this[`_${e}`] !== 'object' || this[`_${e}`] === null);
  if (empty) throw new Error(`Dependency ${empty} must be a non-null object!`);
  if (typeof Reflect.get(this._JSON, 'parse') !== 'function') throw new Error('Invalid JSON object, "parse" function property missing!');
  if (typeof Reflect.get(this._fs, 'statSync') !== 'function') throw new Error('Invalid fs object, "statSync" function property missing!');
  if (typeof Reflect.get(this._path, 'join') !== 'function') throw new Error('Invalid path object, "join" function property missing!');
  if (typeof this._readdir_filter !== 'object' && typeof this._readdir_filter !== 'function' && this._readdir_filter !== null) {
    throw new Error('Invalid readdir filter, readdir_filter must be a function or null');
  }
  /*\
   * The hard Promise safety check has been disabled due to the wide variety of Promise libraries out there.
   * If you plan to provide your own Promise library, ensure that it can be constructed as a normal Promise and .then works as intended.
  \*/
  // if (typeof Reflect.get(this._Promise, 'resolve') !== 'function') {
  //   throw new Error('Invalid Promise object, "resolve" function property missing!');
  // }

  const proxy = this.proxy = new Proxy((arga => {
    if (!arga) return this._path.join(this.base, ...this.parts);
    return new PathBuilder(this.base, { JSON, path, fs, Promise, readdir_filter, filter }, [...this.parts, arga.toString()]);
  }).bind(this), { has: has.bind(this), get: get.bind(this) });
  return proxy;
}

PathBuilder.construct_base = (base, opts) => {
  const { rel, path, n } = opts;
  if (path.isAbsolute(base)) return base;
  if (rel) return path.resolve(rel, base);
  if (!base.startsWith('.')) return _resolve(base, path, n);
  return path.resolve(process.cwd(), `.${path.sep}${base}`);
};

PathBuilder.PathBuilder = PathBuilder.default = PathBuilder;
exports.default = PathBuilder;
