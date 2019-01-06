const Builder = require('..');

function filter(p) {
  /* eslint-disable no-invalid-this */
  const isdir = this.get_stat_sync(p).directory;
  if (isdir && Builder(p, { filter }).$readdirsync.every(subpath => !this.get_stat_sync(subpath).directory)) return false;

  return isdir;
  /* eslint-enable no-invalid-this */
}

const folders = Builder('../src', { filter })
  .$readdirsync.filter(e => !Builder(e).$statsync.file);
console.dir(folders); // eslint-disable-line no-console
