'use strict';
Reflect.defineProperty(exports, '__esModule', { value: true });

const { traps: { has, get } } = require('../deps');
const ReadHelper = require('./ReadHelper').default;

function PathBuilder(base = process.cwd(), {
  JSON = global.JSON,
  path = require('path'),
  fs = require('fs'),
  Promise = global.Promise,
} = {}, parts = []) {
  if (!(this instanceof PathBuilder)) return new PathBuilder(base, { JSON, path, fs, Promise }, parts);
  this.base = base;
  this.parts = parts;
  this._JSON = JSON;
  this._path = path;
  this._fs = fs;
  this._Promise = Promise;
  this.read_dir = new ReadHelper(this, { fs, path, Promise });

  // Perform basic checks on potentially user-defined functions
  const empty = ['JSON', 'path', 'fs'].find(e => typeof this[`_${e}`] !== 'object' || this[`_${e}`] === null);
  if (empty) throw new Error(`Dependency ${empty} must be a non-null object!`);
  if (typeof Reflect.get(this._JSON, 'parse') !== 'function') throw new Error('Invalid JSON object, "parse" function property missing!');
  if (typeof Reflect.get(this._fs, 'statSync') !== 'function') throw new Error('Invalid fs object, "statSync" function property missing!');
  if (typeof Reflect.get(this._path, 'join') !== 'function') throw new Error('Invalid path object, "join" function property missing!');

  /*\
   * The hard Promise safety check has been disabled due to the wide variety of Promise libraries out there.
   * If you plan to provide your own Promise library, ensure that it can be constructed as a normal Promise and .then works as intended.
  \*/
  // if (typeof Reflect.get(this._Promise, 'resolve') !== 'function') {
  //   throw new Error('Invalid Promise object, "resolve" function property missing!');
  // }

  const proxy = this.proxy = new Proxy((arga => {
    if (!arga) return this._path.join(this.base, ...this.parts);
    return new PathBuilder(this.base, { JSON, path, fs, Promise }, [...this.parts, arga.toString()]);
  }).bind(this), { has: has.bind(this), get: get.bind(this) });
  return proxy;
}

PathBuilder.PathBuilder = PathBuilder.default = PathBuilder;
exports.default = PathBuilder;
