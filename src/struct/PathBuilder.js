/* eslint-disable no-inline-comments */ //#Todo #HelpWanted : Generate proper documentation for parameters #//
'use strict';
Reflect.defineProperty(exports, '__esModule', { value: true });

const { traps: { has, get } } = require('../deps');
const ReadHelper = require('./ReadHelper').default;

const _resolve = (rel, path, n, p = Error.prepareStackTrace) => {
  Error.prepareStackTrace = (_, $) => $;
  // DebuggingRelInput: console.log('rel', rel)
  // DebuggingStack: console.log(`${Error().stack}`)
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
  load_only_traps = null, // Optionally specify an Array or Set of traps you want to load or skip, i.e, ['$require', '$json']
  exclude_traps = null, // Useful for speeding up trap lookups but do not disable traps you need. They will be silently treated as paths.
  use_cache = true, // Set to false when doing advanced property transforms on PathBuilder objects. This turns into an object later.
} = {}, parts = []) {
  const opts = { JSON, path, fs, Promise, readdir_filter, filter, n, rel, load_only_traps, exclude_traps, use_cache };
  if (!(this instanceof PathBuilder)) return new PathBuilder(base, { ...opts, n: 1 }, parts);
  this._properties = ['base', 'parts',
    'JSON', 'path', 'fs', 'Promise', 'readdir_filter', 'rel', 'load_only_traps', 'exclude_traps', 'use_cache'];
  this.base = PathBuilder.construct_base(base, opts);
  this.parts = parts;
  this.JSON = JSON; this.path = path;
  this.fs = fs; this.Promise = Promise; // Assign libraries to underscored private property
  this.readdir_filter = readdir_filter || filter;
  this.rel = rel;

  this.use_cache = use_cache;
  // console.log('use cache', use_cache)
  this.read_dir = new ReadHelper(this, opts);
  this.load_only_traps = this.read_dir.load_only_traps;
  this.exclude_traps = this.read_dir.exclude_traps;

  // Perform basic checks on potentially user-defined functions
  const empty = ['JSON', 'path', 'fs'].find(e => typeof this[e] !== 'object' || this[e] === null);
  if (empty) throw new Error(`Dependency ${empty} must be a non-null object!`);
  if (typeof Reflect.get(this.JSON, 'parse') !== 'function') throw new Error('Invalid JSON object, "parse" function property missing!');
  if (typeof Reflect.get(this.fs, 'statSync') !== 'function') throw new Error('Invalid fs object, "statSync" function property missing!');
  if (typeof Reflect.get(this.path, 'join') !== 'function') throw new Error('Invalid path object, "join" function property missing!');
  if (typeof this.readdir_filter !== 'object' && typeof this.readdir_filter !== 'function' && this.readdir_filter !== null) {
    throw new Error('Invalid readdir filter, readdir_filter must be a function or null');
  }
  /*\
   * The hard Promise safety check has been disabled due to the wide variety of Promise libraries out there.
   * If you plan to provide your own Promise library, ensure that it can be constructed as a normal Promise and .then works as intended.
  \*/
  // if (typeof Reflect.get(this.Promise, 'resolve') !== 'function') {
  //   throw new Error('Invalid Promise object, "resolve" function property missing!');
  // }

  const proxy = this.proxy = new Proxy(arga => {
    if (!arga) return this.path.join(this.base, ...this.parts);
    return this.proxy.$_create([...this.parts, arga.toString()]);
  }, { has: has.bind(this), get: get.bind(this) });
  return proxy;
}

PathBuilder.construct_base = (base, opts) => {
  const { rel, path, n } = opts;
  base = typeof base === 'string' || String[Symbol.hasInstance](base) ? base : process.cwd();
  const leading = base.match(/^[.\\/]+/);
  const double_dir = base.match(/^[\\/]{2}/);
  base = path.normalize(base).replace(/[/\\]+$/, ''); // Enforce default
  if (leading && base[0] !== '.') base = path.join(leading[0], base);
  if (double_dir) base = `${path.sep}${base}`;
  if (path.isAbsolute(base)) return base;
  if (rel) return path.resolve(rel, base);
  if (leading) return _resolve(base, path, n); // Dotfiles are a thing
  return path.resolve(process.cwd(), `.${path.sep}${base}`);
};

PathBuilder.cache = {}; // id => <PathBuilder>

PathBuilder.PathBuilder = PathBuilder.default = PathBuilder;

const oldHI = PathBuilder[Symbol.hasInstance];
Object.defineProperty(PathBuilder, Symbol.hasInstance, {
  value: obj => obj && (oldHI.call(PathBuilder, obj) || obj[Symbol.species] === PathBuilder),
});

exports.default = PathBuilder;
