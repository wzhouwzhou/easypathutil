const Builder = require('..');
const pkg_json = new Builder('../package.json');

console.log(`Reading ${pkg_json()}`); // eslint-disable-line no-console

// Read the package.json as if you are require'ing it:
const cached_package_json = pkg_json.$json;
console.log(`The package version is: ${cached_package_json.version}`); // eslint-disable-line no-console

// Running JSON.parse on $readfile / $readfilesync will always get the latest version from the filesystem:
const reloaded_every_time = JSON.parse(pkg_json.$read_file_sync);
console.log(`The package author is: ${reloaded_every_time.author}`); // eslint-disable-line no-console

pkg_json.$read_file.then(raw => {
  const json = JSON.parse(raw);
  console.log(`The package github README is ${json.homepage}`); // eslint-disable-line no-console
});
