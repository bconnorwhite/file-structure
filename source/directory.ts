import merge from "deepmerge";
import path, { Path, PathHook, Parent } from "./path";
import { file, Content, File } from "./file";
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
  DirExistsOptions,
  WriteFileOptions
} from "fs-safe";

export type DirectoryHook<F extends Files> = PathHook<Directory<F>>;

export type Files = {
  [key: string]: PathHook;
};

export type FilesContent = {
  [key: string]: FilesContent | Content;
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
  file: (name: string) => File;
  subdirectory: <G extends Files>(name: string, files?: G) => Directory<G>;
  files: () => {
    [K in keyof F]: ReturnType<F[K]>;
  };
  writeFiles: (content: FilesContent, options?: WriteFileOptions) => Promise<(boolean | undefined)[]>;
}

function getFiles<F extends Files>(dir: Directory<F>, files: F) {
  return Object.keys(files).reduce((retval, key: keyof F) => {
    retval[key] = files[key](dir) as ReturnType<F[keyof F]>;
    return retval;
  }, {} as {
    [K in keyof F]: ReturnType<F[K]>;
  });
}

function isContent(content: FilesContent | Content): content is Content {
  return typeof content === "string" || Buffer.isBuffer(content);
}

function filesFromContent(filesContent: FilesContent): Files {
  return Object.keys(filesContent).reduce((retval, name) => {
    const content = filesContent[name];
    if(isContent(content)) {
      return {
        ...retval,
        [name]: file(name)
      };
    } else {
      return {
        ...retval,
        [name]: directory(name, filesFromContent(content))
      };
    }
  }, {} as Files);
}

function writeFiles(dir: Directory, filesContent: FilesContent, options?: WriteFileOptions) {
  return Object.keys(filesContent).reduce((retval, fileName) => {
    const content = filesContent[fileName];
    if(isContent(content)) {
      retval.push(dir.files()[fileName].write(content, options));
    } else {
      retval.push(...writeFiles(dir.files()[fileName] as Directory<Files>, content, options));
    }
    return retval;
  }, [] as Promise<boolean | undefined>[]);
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
      file: (fileName: string): File => {
        return file(fileName)(dir);
      },
      subdirectory: <G extends Files>(dirName: string, subfiles: G = {} as G) => {
        return directory(dirName, subfiles)(dir);
      },
      files: () => getFiles(dir, files),
      writeFiles: (filesContent: FilesContent, options?: WriteFileOptions) => {
        const newFiles = filesFromContent(filesContent);
        const dirWithFiles = addFiles(parent, name, files, newFiles);
        return Promise.all(writeFiles(dirWithFiles, filesContent, options));
      }
    };
    return dir;
  };
}
