'use strict';
Reflect.defineProperty(exports, '__esModule', { value: true });

const { traps: { has, get } } = require('../deps');

function PathBuilder(base = process.cwd(), parts = []) {
  if (!(this instanceof PathBuilder)) return new PathBuilder(base);
  this.base = base;
  this.parts = parts;

  const proxy = this.proxy = new Proxy((arga => {
    if (!arga) return `${this.base}/${this.parts.join('/')}`.replace(/\/$/, '');
    return new PathBuilder(this.base, [...this.parts, arga.toString()]);
  }).bind(this), { has: has.bind(this), get: get.bind(this) });
  return proxy;
}

PathBuilder.PathBuilder = PathBuilder.default = PathBuilder;
exports.default = PathBuilder;
