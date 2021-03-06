/* eslint consistent-return: 0 */
'use strict';
Reflect.defineProperty(exports, '__esModule', { value: true });

const ReadHelper = class ReadHelper {
  constructor(builder, { fs, path, Promise, readdir_filter, filter } = {}) {
    this.builder = builder;
    this.fs = fs;
    this.path = path;
    this._Promise = Promise;
    this._readdir_filter = readdir_filter || filter;
    this.sync_filter = (this._readdir_filter ? this._readdir_filter.sync || this._readdir_filter :
      _path => this.get_stat_sync(_path).directory).bind(this);
    this.async_filter = (this._readdir_filter ? this._readdir_filter.async || this._readdir_filter.parallel || this._readdir_filter :
      _path => this.get_stat(_path).then(stat => stat.directory)).bind(this);
    this.load_proxy();
  }

  _normalize(sync, filter) {
    if (sync === true && !filter) return this.sync_filter;
    if (sync === false && !filter) return this.async_filter;

    let ref = filter || sync;
    if (ref && Object.prototype.toString.call(ref) === '[object String]') return path => path !== ref;
    if (ref && RegExp[Symbol.hasInstance](ref)) return path => !ref.test(path);
    if (ref && Object.toString.call(ref) === '[object Function]') return ref;
  }

  read_recurse_series(seek, filter = this._normalize(true)) {
    const list = [];
    const read = dir => {
      const files = this.fs.readdirSync(dir);
      for (const file of files) {
        const filepath = this.path.join(dir, file);
        if (filter(filepath)) read(filepath);
        else list.push(filepath);
      }
    };
    read(this.path.resolve(seek));
    return list;
  }
  sync(...args) { return this.read_recurse_series(...args); }

  read_recurse_parallel(dir, filter = this._normalize(false), suppress = false) {
    return new this._Promise((res, rej) => {
      let results = [];
      return this.fs.readdir(dir, (__err, list) => {
        if (__err && !suppress) return rej(__err);
        if (suppress) return res([]);
        let pending = list.length;
        if (!pending) return res(results);
        list.forEach(filen => {
          const file = this.path.resolve(dir, filen);
          this.fs.stat(file, async(_err, stat) => {
            try {
              if (_err && !suppress) return rej(_err);
              if (suppress) return res([]);
              if (stat && await filter(file)) {
                return this.read_recurse_parallel(file, filter, suppress)
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
            } catch (err) {
              if (!suppress) return rej(err);
              return null;
            }
          });
        });
      });
    });
  }
  parallel(...args) { return this.read_recurse_parallel(...args); }

  get_stat_sync(path, stringprop = '') {
    try {
      const bigInt = !stringprop.toLowerCase().includes('legacy') && !stringprop.toLowerCase().includes('number');
      const stat = this.fs.statSync(path, { bigInt }),
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
        // Throw to bottom catch to re-throw
        throw err;
      }
    } catch (err) {
      if (err && err.code === 'ENOENT') return false;
      throw err;
    }
  }

  get_stat(path, stringprop = '') {
    try {
      const bigInt = !stringprop.toLowerCase().includes('legacy') && !stringprop.toLowerCase().includes('number');
      try {
        return new Promise((res, rej) => this.fs.stat(path, { bigInt }, (err, stat) => this.get_stat_cb(err, stat, { res, rej })));
      } catch (_node_version_error) {
        return new Promise((res, rej) => this.fs.stat(path, (err, stat) => this.get_stat_cb(err, stat, { res, rej })));
      }
    } catch (err) {
      if (err && err.code === 'ENOENT') return this._Promise.resolve(false);
      return this._Promise.reject(err);
    }
  }

  get_stat_cb(err, stat, { res, rej }) {
    if (err) {
      if (err.code === 'ENOENT') return res(false);
      return rej(err);
    }

    const isDir = stat.isDirectory(),
      isFile = stat.isFile(),
      isBigInt = typeof stat.size === 'bigint'; // eslint-disable-line valid-typeof
    try {
      return res({ ...stat,
        isBigInt,
        isFile, file: isFile,
        isDir, folder: isDir,
        directory: isDir,
        isFolder: isDir,
        isDirectory: isDir,
      });
    } catch (_err) {
      if (_err && _err instanceof SyntaxError) {
        return res(Object.assign(stat, {
          isBigInt,
          file: isFile,
          folder: isDir,
          directory: isDir,
        }));
      }
      return rej(_err);
    }
  }

  load_proxy() {
    const list = this.read_recurse_series(this.path.resolve(__dirname, '../deps/traps'),
      e => this.get_stat_sync(e).directory);
    this.traps = [];
    for (const { condition, value } of list.map(require)) {
      this.traps.push({
        condition,
        value: value.bind(this.builder),
      });
    }
    this.builder.traps = this.traps;
    return this.builder;
  }
};

exports.default = ReadHelper;
