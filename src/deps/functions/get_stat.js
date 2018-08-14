'use strict';
Reflect.defineProperty(exports, '__esModule', { value: true });

const fs = require('fs');

exports.default = (path, stringprop) => {
  try {
    const bigInt = !stringprop.toLowerCase().includes('legacy') && !stringprop.toLowerCase().includes('number');
    const stat = fs.statSync(path, { bigInt }),
      isDir = stat.isDirectory(),
      isFile = stat.isFile(),
      isBigInt = typeof stat.size === 'bigint'; // eslint-disable-line valid-typeof
    try {
      return { ...stat, isBigInt, isFile, file: isFile, isDir, folder: isDir, directory: isDir, isFolder: isDir, isDirectory: isDir };
    } catch (err) {
      if (err && err instanceof SyntaxError) {
        return Object.assign(stat, {
          isBigInt,
          file: isFile,
          folder: isDir,
          directory: isDir,
        });
      }
      throw err;
    }
  } catch (err) {
    if (err && err.code === 'ENOENT') return false;
    throw err;
  }
};
