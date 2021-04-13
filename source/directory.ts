import merge from "deepmerge";
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
  dirExists,
  DirExistsOptions
} from "fs-safe";

type DirectoryHook<F extends Files> = PathHook<Directory<F>>;

export type Files = {
  [key: string]: PathHook;
};

function addFiles<F extends Files, N extends Files>(parent: Parent, name: string, files: F, newFiles: N): Directory<F & N> {
  const combinedFiles = merge(files, newFiles) as F & N;
  return directory(name, combinedFiles)(parent);
}

export interface Directory<F extends Files = Files> extends Path {
  add: <N extends Files>(files: N) => Directory<F & N>;
  exists: (options?: DirExistsOptions) => Promise<boolean | undefined>;
  read: (options?: ReadDirOptions) => Promise<string[] | undefined>;
  write: (options?: WriteDirOptions) => Promise<boolean | undefined>;
  remove: (options?: RemoveDirOptions) => Promise<boolean | undefined>;
  watch: () => DirWatcher;
  files: () => {
    [K in keyof F]: ReturnType<F[K]>;
  };
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
      add: <N extends Files>(newFiles: N): Directory<F & N> => addFiles(parent, name, files, newFiles),
      exists: (options?: DirExistsOptions) => dirExists(dirPath.path, options),
      read: (options?: ReadDirOptions) => readDir(dirPath.path, options),
      write: (options?: WriteDirOptions) => writeDir(dirPath.path, options),
      remove: (options?: RemoveDirOptions) => removeDir(dirPath.path, options),
      watch: () => watchDir(dirPath.path),
      files: () => getFiles(dir, files)
    };
    return dir;
  };
}
