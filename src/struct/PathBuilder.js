'use strict';
Reflect.defineProperty(exports, '__esModule', { value: true });

const { traps: { has, get } } = require('../deps');

function PathBuilder(base = process.cwd(), {
  JSON = global.JSON,
  path = require('path'),
  fs = require('fs'),
} = {}, parts = []) {
  if (!(this instanceof PathBuilder)) return new PathBuilder(base, { JSON, path, fs }, parts);
  this.base = base;
  this.parts = parts;
  this._JSON = JSON;
  this._path = path;
  this._fs = fs;

  // Perform basic checks on potentially user-defined functions
  const empty = ['JSON', 'path', 'fs'].find(e => typeof this[`_${e}`] !== 'object' || this[`_${e}`] === null);
  if (empty) throw new Error(`Dependency ${empty} must be a non-null object!`);
  if (typeof Reflect.get(this._JSON, 'parse') !== 'function') throw new Error('Invalid JSON object, "parse" function property missing!');
  if (typeof Reflect.get(this._fs, 'statSync') !== 'function') throw new Error('Invalid fs object, "statSync" function property missing!');
  if (typeof Reflect.get(this._path, 'join') !== 'function') throw new Error('Invalid path object, "join" function property missing!');

  const proxy = this.proxy = new Proxy((arga => {
    if (!arga) return this._path.join(this.base, ...this.parts);
    return new PathBuilder(this.base, { JSON, path, fs }, [...this.parts, arga.toString()]);
  }).bind(this), { has: has.bind(this), get: get.bind(this) });
  return proxy;
}

PathBuilder.PathBuilder = PathBuilder.default = PathBuilder;
exports.default = PathBuilder;
