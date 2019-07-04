const Builder = require('..');
const pkg_json = Builder('../package.json', { load_only_traps: ['$json'] });
const dump = Builder('./dump', { load_only_traps: ['$writefile'] });

// Read the package.json
console.log(`Reading ${pkg_json()}`); // eslint-disable-line no-console
const cached_package_json = pkg_json.$json;
console.log(`The package version is: ${cached_package_json.version}`); // eslint-disable-line no-console

const new_json_file = dump['new.json'];
console.log(`Writing to ${new_json_file()}`); // eslint-disable-line no-console

/*
 * Test: repeated writes to a file. Change "N" to modify the number of iterations.
 */

let write_file_sync, delta, now, k = 0, N = process.argv[2] || 20000;
console.log('Testing with loop count of:', N); // eslint-disable-line no-console
const str = JSON.stringify(cached_package_json, 0, 2), content = `${str}\n`, opts = { encoding: 'utf-8' };

write_file_sync = new_json_file.$write_file_sync;
now = Date.now();
while (k++ < N) write_file_sync(content, opts);
delta = Date.now() - now;

console.log(`EPU Time taken = ${delta} ms`); // eslint-disable-line no-console

k = 0;
const fs = require('fs'), _path = require('path'); // eslint-disable-line no-unused-vars
const new_path = new_json_file();
write_file_sync = fs.writeFileSync;

const get_stat_sync = path => fs.statSync(path); // eslint-disable-line no-unused-vars

now = Date.now();
while (k++ < N) {
  /*
   * Uncomment these lines to use basically the same algorithm run internally by easypathutil for safe path checking.
   */
  // const path = _path.resolve(_path.dirname(new_path));
  // // V10: return this.fs.mkdirSync(path, { recursive: true, ...options });
  // for (let to_create = [, path], i = 1, pending, $stat; i && (pending = to_create[i]);) { // eslint-disable-line no-sparse-arrays
  //   $stat = get_stat_sync(pending);
  //   if (!$stat) to_create[++i] = _path.dirname(pending);
  //   else if (!$stat.isDirectory()) throw new Error(`A non-folder entity already exists at the location [${pending}], aborting mkdir.`);
  //   else if ((pending === path) || !to_create[--i]) break;
  //   else fs.mkdirSync(to_create[i]);
  // }

  write_file_sync(new_path, content, opts);
}
delta = Date.now() - now;

console.log(`FS Time taken = ${delta} ms`); // eslint-disable-line no-console


/*
 * A sample run output on my machine:
Reading /Users/williamzhou/Desktop/Bots/easypathutil/package.json
The package version is: 1.2.4
Testing with loop count of: 20000
EPU Time taken = 4256 ms
FS Time taken = 4210 ms
 *  difference = (4256-4210)/20000 = 0.0023 ms = difference as low as (if not better than) 2.3 microseconds per file!
 *  Would you give away 0000.0000023 seconds during runtime or maybe waste 3600.0000000 seconds (an hour or more) of coding?
Tested on MacBook Pro (15-inch, 2018) 2.9 GHz Intel Core i9 | 32 GB 2400 MHz DDR4 | 2 TB SSD
*/
// eslint-disable-next-line no-console
console.log('Would you rather save dozens of minutes or even hours reinvening the wheel just to shave milliseconds for writing ' +
  `to the file ${N} times?`);
