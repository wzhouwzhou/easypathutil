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

    npm install easypathutil

### Two-Part Motivation
• Avoid a nesting problem of excessive '../../../../../foo/bar' when you can use a fluent object in projects with a more invariant file structure.

• Export the PathBuilder as an npm module to eliminate the need for the above point when attempting to use a PathBuilder.

### Goals/Why use Easypathutil
• This package hopes to make your paths easier to follow for deeply nested files.
• Easily check for existence of a file or folder, read, get stats, or require.
• Lightweight: Package size is around 6kB

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

**Quickstart Usage and Examples**

    const Builder = require('easypathutil');
    const cwd = new Builder;
    cwd() === process.cwd() // true

The `new` keyword is optional, a builder can be retrieved simply with Builder() as well.

**Fluent Interface Examples (chaining, constructor, .toString, [] vs ())**

    // Using process.cwd() (root/home/projects/myfolder) as base
    const myfolder = Builder();

    // Provide the full path:
    const myfolder = new Builder('/root/home/projects/myfolder');

    const myfolderstring = myfolder(); // '/root/home/projects/myfolder'
    const samefolderstring = myfolder.toString(); // toString property turns it back into the path string
    const anotherfolderstring = myfolder.anotherfolder(); // '/root/home/projects/myfolder/anotherfolder'
    const myjsfile = myfolder.foo['bar']('myjsfile.js'); // Access a file named "myjsfile.js" in .../myfolder/foo/bar/
    const samejsfile = myfolder('foo').bar['myjsfile.js']; // Emphasising ability to interchange [] and () for strings instead of dot notation.

    const pathstring = myjsfile(); // '/root/home/projects/myfolder/foo/bar/myjsfile.js'
    myjsfile() === samejsfile(); // true

**Going backwards and resetting to base path (.$back, .$reset)**

    // Reminder: myjsfile() is '/root/home/projects/myfolder/foo/bar/myjsfile.js'
    const barfolder = myjsfile.$back; // $back property goes "back" one level.
    const barfolderpath = barfolder(); // '/root/home/projects/myfolder/foo/bar'
    const baz = myjsfile.$back.baz; // $back can be chained
    const bazpath = baz(); // '/root/home/projects/myfolder/foo/bar/baz'

    const myfolder2 myjsfile.$reset // $reset property resets the builder back to the base path.
    myfolder2() === myfolder(); // true, both are '/root/home/projects/myfolder'

**Get file contents (.$readfile, .$readfilesync)**

    const myjsfilebuffer = myjsfile.$readfilesync; // $readfilesync property calls fs.readFileSync
    const myjsfilebufferpromise = myjsfile.$readfile // $readfile returns a promise for async retrieval

    // The following will hence be true or resolve to true:
    myjsfilebuffer === await myjsfilebufferpromise
    myjsfilebuffer.toString() === (await myjsfilebufferpromise).toString()
    myjsfilebufferpromise.then(filedata => filedata === myjsfilebuffer)
    myjsfilebufferpromise.then(filedata => filedata.toString() === myjsfilebuffer.toString())

    // optional "." or "_" and case insensitive
    myjsfile.$read_file, myjsfile.$read_file_sync
    myjsfile.$readfile, myjsfile.$readfile_sync
    myjsfile['$readFile'], myjsfile['$readFileSync']
    myjsfile('$read_File'), myjsfile('$readFile_Sync')

**Easy require (.$require, $require_default)**

    const imported = myjsfile.$require; // $require property wraps a require() around the target.
    const defaultimport = myjsfile.$require_default; // Attempts an "interop require default" style default import
    imported.default === defaultimport // true if myjsfile points to an esModule. Note: imported.default will Always work, regardless if it is an esModule (you can stick to .$require_default to be safe, unless you know what you are doing).

Aliases: $require_default, $requiredefault, $requireDefault, etc, optional "." or "\_" and case insensitive

**Load JSON without require (.$json)**

    const jsonfile = myfolder('jsonfile.json'); // Points to /root/home/projects/myfolder/jsonfile.json
    const parsedjson = jsonfile.$json // Aliases: .$json, .$toJson, .$JSON, .$to_json, etc, optional "." or "_" and case insensitive

**New object shortcut (.$new, .$new_default)**

Before:

    const object = new require('../../path/to/myjsfile');
    const defaultobject = new (require('../../path/to/myjsfile').default);

After (with myjsfile as myfolder.foo.bar.myjsfile):

    const object2 = myjsfile.$new; // .$new creates a new instance of the result of .$require
    const defaultobject2 = myjsfile.$new_default; // .$new_default and aliases create new instances of .$require_default

Aliases: $newDefault, $newdefault, etc, optional "." or "\_" and case insensitive

**About .$stat**

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

This package adapts as needs arise, and although it has been tested on some versions of node v8 and v10, problems may still occur.

Enjoy this package? Consider starring on [github](https://github.com/wzhouwzhou/easypathutil) and checking out some of my other work:
[Youtube Search API](https://npmjs.com/ytsearcher)
