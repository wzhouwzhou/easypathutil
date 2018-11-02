/* eslint consistent-return: 0 */
'use strict';
Reflect.defineProperty(exports, '__esModule', { value: true });

const fs = require('fs');

const read_recurse_series = (seek, path) => {
  const list = [];
  const read = dir => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filepath = path.join(dir, file);
      if (fs.statSync(filepath).isDirectory()) read(filepath);
      else list.push(filepath);
    }
  };
  read(seek);
  return list;
};

const read_recurse_parallel = (dir, path, suppress = false) => new Promise((res, rej) => {
  let results = [];
  return fs.readdir(dir, (__err, list) => {
    if (__err && !suppress) return rej(__err);
    if (suppress) return res([]);
    let pending = list.length;
    if (!pending) return res(results);
    list.forEach(filen => {
      const file = path.resolve(dir, filen);
      fs.stat(file, (_err, stat) => {
        if (_err && !suppress) return rej(_err);
        if (suppress) return res([]);
        if (stat && stat.isDirectory()) {
          return read_recurse_parallel(file, path, suppress)
            .then(next => {
              results = results.concat(next);
              if (!--pending) return res(results);
            }).catch(err => {
              if (err && !suppress) return rej(err);
              if (suppress) return res([]);
            });
        } else {
          results.push(file);
          if (!--pending) return res(results);
        }
      });
    });
  });
});

exports.sync = read_recurse_series;
exports.parallel = read_recurse_parallel;
exports.default = {
  sync: read_recurse_series,
  parallel: read_recurse_parallel,
};
