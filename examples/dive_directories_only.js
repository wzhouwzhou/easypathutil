const Builder = require('..');

function filter(p) {
  /* eslint-disable no-invalid-this */
  const isdir = this.get_stat_sync(p).directory;
  if (isdir && Builder(p, { filter }).$readdirsync.every(subpath => !this.get_stat_sync(subpath).directory)) return false;

  return isdir;
  /* eslint-enable no-invalid-this */
}
const src = Builder('../src', { filter });
// Help wanted - src as a second argument on windows is resolving as Function instead of going through the proxy
console.log(`Reading folder: ${src}`); // eslint-disable-line no-console
const folders = src.$readdirsync.filter(e => !Builder(e).$statsync.file);
console.dir(folders); // eslint-disable-line no-console
