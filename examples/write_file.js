const Builder = require('..');
const pkg_json = Builder('../package.json');
const dump = Builder('./dump', { load_only_traps: ['$writefile', '$readfile', '$rm'] });

// Read the package.json
console.log(`Reading ${pkg_json()}`); // eslint-disable-line no-console
const cached_package_json = pkg_json.$json;
console.log(`The package version is: ${cached_package_json.version}`); // eslint-disable-line no-console

// Copy the json to a new file.
const new_json_file = dump['new.json'];
new_json_file.$write_file_sync(`${JSON.stringify(cached_package_json, 0, 2)}\n`);

/* eslint-disable no-console */
// Ensure the file contents are the same
console.log(`Wrote a copy to ${new_json_file}, Equal content:`,
  new_json_file.$read_file_sync.toString() === pkg_json.$read_file_sync.toString());
console.log('Lengths:', new_json_file.$read_file_sync.toString().length, pkg_json.$read_file_sync.toString().length);
/* eslint-enable no-console */

// new_json_file.$rm_sync_func();
delete dump['new.json'];
