import path, { Path, PathHook, Parent } from "./path";
import {
  readDir,
  ReadDirOptions,
  writeDir,
  WriteDirOptions,
  removeDir,
  RemoveDirOptions,
  watchDir,
  DirWatcher,
  dirExists
} from "fs-safe";

type DirectoryHook<F extends Files> = PathHook<Directory<F>>;

export type Files = {
  [key: string]: PathHook;
};

export interface Directory<F extends Files> extends Path {
  exists: () => Promise<boolean | undefined>;
  read: (options?: ReadDirOptions) => Promise<string[] | undefined>;
  write: (options?: WriteDirOptions) => Promise<boolean | undefined>;
  remove: (options?: RemoveDirOptions) => Promise<boolean | undefined>;
  watch: () => DirWatcher;
  files: () => {
    [K in keyof F]: ReturnType<F[K]>;
  };
  _files: F;
}

function getFiles<F extends Files>(dir: Directory<F>, files: F) {
  return Object.keys(files).reduce((retval, key: keyof F) => {
    retval[key] = files[key](dir) as ReturnType<F[keyof F]>;
    return retval;
  }, {} as {
    [K in keyof F]: ReturnType<F[K]>;
  });
}

export function directory<F extends Files>(name: string, files: F = {} as F): DirectoryHook<F> {
  return (parent: Parent) => {
    const dirPath = path(parent, name);
    const dir: Directory<F> = {
      ...dirPath,
      exists: () => dirExists(dirPath.path),
      read: (options?: ReadDirOptions) => readDir(dirPath.path, options),
      write: (options?: WriteDirOptions) => writeDir(dirPath.path, options),
      remove: (options?: RemoveDirOptions) => removeDir(dirPath.path, options),
      watch: () => watchDir(dirPath.path),
      files: () => getFiles(dir, files),
      _files: files
    }
    return dir;
  }
}
