<div align="center">
    <br />
    <p>
        <a class="badge-align" href="https://www.codacy.com/app/wzhouwzhou/easypathutil?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=wzhouwzhou/easypathutil&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/d54c94b0c32e45bc8046d2825eb474cb"/></a>
        <a href="https://www.npmjs.com/package/easypathutil"><img src="https://img.shields.io/npm/v/easypathutil.svg" alt="NPM version" /></a>
        <a href="https://www.npmjs.com/package/easypathutil"><img src="https://img.shields.io/npm/dt/easypathutil.svg" alt="NPM downloads" /></a>
        <a href="https://david-dm.org/wzhouwzhou/easypathutil"><img src="https://img.shields.io/david/wzhouwzhou/easypathutil.svg" alt="Dependencies" /></a>
        <a href="https://paypal.me/wzhouwzhou"><img src="https://img.shields.io/badge/donate-paypal-009cde.svg" alt="Paypal" /></a>
    </p>
    <p>
        <a href="https://nodei.co/npm/easypathutil/"><img src="https://nodei.co/npm/easypathutil.png?stars=true&downloads=true"></a>
    </p>
</div>

# Easypathutil
## Fluent filepaths, made simple.

The modern (es6) way to specify file paths and perform quick file system operations, with no third party dependencies.

## One Step Installation:

    npm install easypathutil@1.2.4

### Two-Part Motivation
• Avoid a nesting problem of excessive '../../../../../foo/bar' when you can use a fluent object in projects with a more invariant file structure.

• Export the PathBuilder as an npm module to eliminate the need for the above point when attempting to use a PathBuilder.

### Goals/Why use Easypathutil
• This package hopes to make your paths easier to follow for deeply nested files.

• Easily check for existence of or load a file or folder, read, get stats, or require.

• Updated and Lightweight: Package size <10kB

The tutorial below aims to demonstrate the core functionality of this package.

### Show me in action
Three files: /data/users.json, /classes/A.js and /a/b/c/d/e/nested.js

nested.js:
**Before:**

    const file = require('fs').readFileSync(require('path').join(__dirname, '../../../../data/users.json'));
    const json = JSON.parse(file);
    const default_object = new (require(require('path').join(__dirname, '../../../../classes/A')).default);

**After:**

    const cwd = require('easypathutil')();
    const json = cwd.data['users.json'].$json;
    const default_object = cwd.classes.A.$new_default;

#### **Quickstart Usage and Examples**

    const Builder = require('easypathutil');
    const cwd = new Builder;
    cwd() === process.cwd() // true

The `new` keyword is optional, a builder can be retrieved simply with Builder() as well.

#### **Fluent Interface Examples (chaining, constructor, .toString, [] vs ())**

    // Using process.cwd() (root/home/projects/myfolder) as base
    const myfolder = Builder();

    // Or provide the full path:
    const myfolder = new Builder('/root/home/projects/myfolder');

    // Or (for more advanced users) provide custom JSON, path and fs object:
    const myfolder = new Builder('/root/home/projects/myfolder', {
      JSON: someJsonPackage || global.JSON,
      fs: someFsPackage || require('fs'),
      path: somePathPackage || require('path'),
      Promise: somePromisePackage || global.Promise,
      filter: filepath => should_dive_folder(filepath), // This function checks recursive directory dives with a given filter. More below.
    });

    const myfolderstring = myfolder(); // '/root/home/projects/myfolder'
    const samefolderstring = myfolder.toString(); // toString property turns it back into the path string
    const anotherfolderstring = myfolder.anotherfolder(); // '/root/home/projects/myfolder/anotherfolder'
    const myjsfile = myfolder.foo['bar']('myjsfile.js'); // Access a file named "myjsfile.js" in .../myfolder/foo/bar/
    const samejsfile = myfolder('foo').bar['myjsfile.js']; // Emphasising ability to interchange [] and () for strings instead of dot notation.

    const pathstring = myjsfile(); // '/root/home/projects/myfolder/foo/bar/myjsfile.js'
    myjsfile() === samejsfile(); // true

#### **Going backwards and resetting to base path (.$back, .$reset)**

    // Reminder: myjsfile() is '/root/home/projects/myfolder/foo/bar/myjsfile.js'
    const barfolder = myjsfile.$back; // $back property goes "back" one level.
    const barfolderpath = barfolder(); // '/root/home/projects/myfolder/foo/bar'
    const baz = myjsfile.$back.baz; // $back can be chained
    const bazpath = baz(); // '/root/home/projects/myfolder/foo/bar/baz'

    const myfolder2 myjsfile.$reset // $reset property resets the builder back to the base path.
    myfolder2() === myfolder(); // true, both are '/root/home/projects/myfolder'

#### **Get file contents (.$readfile, .$readfilesync)**

    const myjsfilebuffer = myjsfile.$readfilesync; // $readfilesync property calls fs.readFileSync
    const myjsfilebufferpromise = myjsfile.$readfile // $readfile returns a promise for async retrieval

    // The following will hence be true or resolve to true:
    myjsfilebuffer !== await myjsfilebufferpromise
    myjsfilebuffer.toString() === (await myjsfilebufferpromise).toString()
    myjsfilebufferpromise.then(filedata => filedata !== myjsfilebuffer)
    myjsfilebufferpromise.then(filedata => filedata.toString() === myjsfilebuffer.toString())

    // optional "." or "_" and case insensitive
    myjsfile.$read_file, myjsfile.$read_file_sync
    myjsfile.$readfile, myjsfile.$readfile_sync
    myjsfile['$readFile'], myjsfile['$readFileSync']
    myjsfile('$read_File'), myjsfile('$readFile_Sync')

#### **Easy require (.$require, $require_default)**

    const imported = myjsfile.$require; // $require property wraps a require() around the target.
    const defaultimport = myjsfile.$require_default; // Attempts an "interop require default" style default import
    imported.default === defaultimport // true if myjsfile points to an esModule. Note: imported.default will Always work, regardless if it is an esModule (you can stick to .$require_default to be safe, unless you know what you are doing).

Aliases: $require_default, $requiredefault, $requireDefault, etc, optional "." or "\_" and case insensitive

#### **Load JSON without require (.$json)**

    const jsonfile = myfolder('jsonfile.json'); // Points to /root/home/projects/myfolder/jsonfile.json
    const parsedjson = jsonfile.$json // Aliases: .$json, .$toJson, .$JSON, .$to_json, etc, optional "." or "_" and case insensitive

#### **Read directory recursively, returning an array of absolute paths to files (.$read_dir, .$read_dir_sync)**

    const filearray = myfolder.$read_dir_sync
    myfolder.$read_dir.then(filearray2 => {
      // same array contents as filearray
    });
    // Aliases .$readdir, .$readDirsync, etc. as always, "." or "_" are optional and case insensitive

**Advanced Feature: Recursive Dive Prevention**

Please note that this feature is for more advanced users only who specifically have this need. You may skip down to the next section if you
are reading directories only for files. 

Recall back to how to construct the object with options:

    const myfolder = new Builder('/root/home/projects/myfolder', {
      /* …other options… */
      filter: filepath => should_dive_folder(filepath), // This function checks recursive directory dives with a given filter. More below.
    });

The filter function can be used to prevent recursive dives. This is useful if you want a list of *folders*. After all, if you wanted to
filter the files returned, the fastest way would be read every file with a basic `myfolder.$readdirsync` and then apply a
`.filter(e => e.endsWith('.mycustomextension')` to the array returned. However, what if you only wanted to read every folder underneath,
say, /src? What if you had a situation where you had folders structured like: `/data/translations/en/data1.json`,
`/data/translations/en/data2.json`, `/data/translations/es/data1.json`, etc, but you only wanted the folder locations, namely
`/data/translations/en/`, `/data/translations/es/`, etc?

**In comes the filter function!**

The filter function filters *out* paths to which it returns true during recursion, and you must apply Array#filter to *keep* what you want.

In our first example, you must create a new object like so:

        const array = Builder('/some/path/here' || myfolder() || process.cwd(), {
          filter: function filter(path) { return path.endsWith('.ext') && !this.get_stat_sync(path).directory; }
        }).$readdirsync
          .filter(e => e.endsWith('.ext'));

This will return everything, files and folders, whos name ends with .ext

        Optionally, declare the function beforehand:
        function filter(path) {
          return !path.endsWith('.ext') && this.get_stat_sync(path).directory;
        }

        const array = Builder(absolutepath, { filter }).$readdirsync
          .filter(path => path.endsWith('.ext'));

Don't want the files? You can chain Array#filter in nodejs

        const folders_only = array.filter(path => require('fs').statSync(path).isDirectory()); 

Or just filter once for better performance:

        const array = Builder(absolutepath, { filter }).$readdirsync
          .filter(path => path.endsWith('.ext') && require('fs').statSync(path).isDirectory());

You may specify also filter parameter as two seperate functions for synchronous and async versions of .$readdir and .$readdirsync

        const sync = function filter_sync(path) {
           return !path.endsWith('.ext') && this.get_stat_sync(path).directory;
        };
        
        const async = async function filter_async(path) {
          if (path.endsWith('.ext')) return false; // Think about this line as: if the file or folder we are looking at ends with .ext, stop recursing.
          const { directory } = await this.get_stat(path);
          return directory; // If directory is true, the path refers to a directory, so keep recursing, in case such files or folders that match the above case reside in subfolders of the one we are currently looking at. 
        };
        
        const folder = Builder(absolutepath, {
          filter: { sync, async },
        });

        // Use the synchronous version:
        const array = folder.$readdirsync.filter(path => path.endsWith('.ext') && require('fs').statSync(path).isDirectory());

        // Use the parallel/asynchronous version:
        const fs = require('fs');

        // Don't forget, you do not need to use .endsWith!
        // path.startsWith, regular expressions, and many more also work, as the path string can be freely manipulated
        // This applies to the filter functions as well!  
        const promises = await folder.$readdir.map(path => /\.ext$/.test(path) && new Promise((res, rej) => {
            fs.stat(path, (err, stats) => {
                if (err) return rej(err);
                if (stats.isDirectory()) return res(path);
                return res(false);
            });
        });
        const array = await Promise.all(promises).filter(_ => _);

What about your second example with the translations?

        function filter(e) { return !e.includes('translations') && this.get_stat_sync(e).directory; };  
        const array = Builder(process.cwd(), { filter }).subfolder.data.$readdirsync; // Reminder: we can use the same Builder to get to the folder first!

The const array will now contain an array with everything one-level deep into /subfolder/data/translations. In our example, these would be
the two .../en and .../es folders 

Notice my usage of the keyword `function` when creating these filter functions. I have not used arrow functions (=> lambdas) because of my
use of "this" (this.get_stat_sync). The filter function is bound to the library's ReadHelper objects, which contain several internal helper
functions to help abstract the directory reading process away from the node fs module. You are free to use arrow functions when this binding
functionality is not of use to you. 

Have a more specific use case that you don't believe this covers? Open an issue on this package's github repository (linked below)!

#### **New object shortcut (.$new, .$new_default)**

Before:

    const object = new require('../../path/to/myjsfile');
    const defaultobject = new (require('../../path/to/myjsfile').default);

After (with myjsfile as myfolder.foo.bar.myjsfile):

    const object2 = myjsfile.$new; // .$new creates a new instance of the result of .$require
    const defaultobject2 = myjsfile.$new_default; // .$new_default and aliases create new instances of .$require_default

Aliases: $newDefault, $newdefault, etc, optional "." or "\_" and case insensitive

#### **File stats (.$stat)**

    // Get file stats synchronously instead of wrapping with fs.statSync with extra function calls
    const myjsfilestat = myjsfile.$stat // $stat property returns an object containing file stats.

**myjsfilestat ($stat) contains three custom properties: isBigInt, file, and folder.**

• myjsfilestat.file is true when the item is a file. Aliases: $stat.isFile

• myjsfilestat.folder is true when the item is a folder. Aliases: $stat.isFolder, $stat.dir, $stat.isDir, $stat.directory, $stat.isDirectory

• isBigInt tells you if the data such as size in the object is using bigints instead of numbers. This helps clarify ambiguity regarding node versions and bigint support

**You can force legacy/number for data (.$stat_legacy, .$stat_number)**

    const myjsfilestatlegacy = myjsfile.$stat_legacy // .$statLegacy, .$statNumber, optional . or _ and case insensitive

**Thus, $stat.size as well as any other property that relies on legacy or bigint/number conversion should always be the same:**

    // All these statements should be true
    Number(myjsfilestat.size) === myjsfilestatlegacy.size
    Number(myjsfilestat.blocks) === myjsfilestatlegacy.blocks
    myjsfilestat.isFile === myjsfilestatlegacy.file
    myjsfilestat.dir === myjsfilestatlegacy.isDirectory

#### **Existence of a file or folder (in operator, Reflect.has, etc)**

    const boolean_exists = 'foldername' in myfolder;
    const boolean_exists2 = Reflect.has(myfolder, 'filename.extension');
    const boolean_exists3 = 'subfoldername' in Object.create(myfolder);

#### **Version**

    const version = require('easypathutil').version;
    version === require('easypathutil').VERSION;

This package adapts as needs arise, and although it has been tested on some versions of node v8 and v10, problems may still occur.

## Changelog
### New in 1.2.4
• Introduced an advanced feature for synchronous and async recursive directory read filtering ("filter" parameter in constructor).

Should you notice anything wrong with this, please do open a reproducible issue or pull request on this package's github repository
(linked below)!
### New in 1.2.3
• Fixed several bugs differentiating between sync and async versions of .$ properties. (i.e. file.$stat and file.$stat.sync)

• Fixed async reading of folders

### New in 1.2.2
• Fixed a bug relating to Promise not being loaded into the ReadHelper, causing async operations to fail

### New in 1.2.1
• Fixed a bug relating to a new loader implemented in 1.2.0 causing crashes

### New in 1.2.0
• Completely refactored internals that power the fluent API

• Provide your own Promise library

### New in 1.1.0
• Provide your own JSON, path, or fs objects

• More reliable path support (slash vs backslash)

#### Enjoy this package?
Consider starring on [github](https://github.com/wzhouwzhou/easypathutil) and checking out some of my other work:

[Youtube Search API](https://npmjs.com/ytsearcher)

[Urban Dictionary](https://npmjs.com/easyurban)

Need support? Send me an email at wzhouwzhou@gmail.com, or connect with me on Discord at https://discord.gg/jj5FzF7 (William Zhou#0001)

Like what you're seeing? Consider helping to fund my education through https://paypal.me/wzhouwzhou  
