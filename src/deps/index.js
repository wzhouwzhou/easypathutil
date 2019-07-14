'use strict';
Reflect.defineProperty(exports, '__esModule', { value: true });

exports.traps = {
  has: require('./functions/has.trap').default,
  get: require('./functions/get.trap').default,
  deleteProperty: require('./functions/deleteProperty.trap').default,
};
