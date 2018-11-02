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

  const proxy = this.proxy = new Proxy((arga => {
    if (!arga) return this._path.join(this.base, ...this.parts);
    return new PathBuilder(this.base, { JSON, path, fs }, [...this.parts, arga.toString()]);
  }).bind(this), { has: has.bind(this), get: get.bind(this) });
  return proxy;
}

PathBuilder.PathBuilder = PathBuilder.default = PathBuilder;
exports.default = PathBuilder;
