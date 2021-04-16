<div align="center">
  <h1>file-structure</h1>
  <a href="https://npmjs.com/package/file-structure">
    <img alt="NPM" src="https://img.shields.io/npm/v/file-structure.svg">
  </a>
  <a href="https://github.com/bconnorwhite/file-structure">
    <img alt="TypeScript" src="https://img.shields.io/github/languages/top/bconnorwhite/file-structure.svg">
  </a>
  <a href='https://coveralls.io/github/bconnorwhite/file-structure?branch=master'>
    <img alt="Coverage Status" src="https://img.shields.io/coveralls/github/bconnorwhite/file-structure.svg?branch=master">
  </a>
  <a href="https://github.com/bconnorwhite/file-structure">
    <img alt="GitHub Stars" src="https://img.shields.io/github/stars/bconnorwhite/file-structure?label=Stars%20Appreciated%21&style=social">
  </a>
  <a href="https://twitter.com/bconnorwhite">
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/bconnorwhite.svg?label=%40bconnorwhite&style=social">
  </a>
</div>

<br />

> Define and manage file structures.

## Installation

```bash
yarn add file-structure
```

```bash
npm install file-structure
```

<br />

## API

Use root to define a file structure:

```ts
import { root, directory, file } from "file-structure";

const structure = root("/path/to/root/", { // This path defaults to process.cwd()
  source: directory("source", {
    index: file("index.ts")
  }),
  notes: file("notes.txt")
});
```

From this structure, we can easily get files and their paths:

```ts
console.log(structure.files().notes.path); // /path/to/root/notes.txt
console.log(structure.files().source.relative); // source
console.log(structure.files().source.files().index.relative); // source/index.ts
```

Directories and files also have these additional methods:

```ts
structure.files().source.exists();
structure.files().source.read();
structure.files().source.write();
structure.files().source.remove();
structure.files().source.watch();
```

Files can be added later to directories:
```ts
directory.add({
  myNewFile: file("test.txt")
});
```

Or get a file/subdirectory relative to a directory:
```ts
const subFile = directory.file("test.txt");

const subDirectory = directory.subdirectory("sub", {
  myNewFile: file("test.txt");
});
```

Several other file types are included with specialized return types:

```ts
import {
  root,
  directory,
  file,
  jsonFile,
  packageJSONFile,
  tsConfigJSONFile,
  markdownFile,
  lcovFile
} from "file-structure";

const structure = root({
  file: file("file.txt"),
  json: jsonFile("file.json"),
  packageJSON: packageJSONFile(), // default: "package.json"
  tsConfig: tsConfigJSONFile(), // default: "tsconfig.json"
  readme: markdownFile("README.md"),
  coverage: directory("coverage", {
    lcov: lcovFile("lcov.info")
  })
});
```

<br />

<h2>Dependencies<img align="right" alt="dependencies" src="https://img.shields.io/david/bconnorwhite/file-structure.svg"></h2>

- [fs-safe](https://www.npmjs.com/package/fs-safe): A simple fs wrapper that doesn't throw
- [read-file-safe](https://www.npmjs.com/package/read-file-safe): Read files without try catch
- [read-lcov-safe](https://www.npmjs.com/package/read-lcov-safe): Read and parse an lcov file without try catch
- [read-md-safe](https://www.npmjs.com/package/read-md-safe): Read markdown files as a Marked token list or string
- [types-pkg-json](https://www.npmjs.com/package/types-pkg-json): Type checking for package.json
- [types-tsconfig](https://www.npmjs.com/package/types-tsconfig): Type checking for tsconfig.json
- [write-md-safe](https://www.npmjs.com/package/write-md-safe): Write markdown files from a Marked token list or string

<br />

<h2>Dev Dependencies<img align="right" alt="David" src="https://img.shields.io/david/dev/bconnorwhite/file-structure.svg"></h2>

- [@bconnorwhite/bob](https://www.npmjs.com/package/@bconnorwhite/bob): undefined
- [@types/object-map](https://www.npmjs.com/package/@types/object-map): undefined

<br />

<h2>License <img align="right" alt="license" src="https://img.shields.io/npm/l/file-structure.svg"></h2>

[MIT](https://opensource.org/licenses/MIT)
