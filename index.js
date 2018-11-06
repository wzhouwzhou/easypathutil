'use strict';
Reflect.defineProperty(exports, '__esModule', { value: true });

const PathBuilder = require('./src/struct/PathBuilder').default;
const version = PathBuilder(__dirname)['package.json'].$json.version;
Object.defineProperties(PathBuilder, {
  version: { value: version },
  VERSION: { value: version },
});

module.exports = PathBuilder;
