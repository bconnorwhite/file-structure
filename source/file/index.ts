import { removeFile, watchFile, FileWatcher, fileExists, FileExistsOptions } from "fs-safe";
import path, { Parent, Path, PathHook } from "../path";

type FileFields = {
  [field: string]: any;
};

export type FileBase = Path & {
  exists: () => Promise<boolean | undefined>;
  remove: () => Promise<boolean | undefined>;
  watch: () => FileWatcher;
};

export type FileBaseHook<T extends FileBase = FileBase> = PathHook<T>;

export type FileType<T extends FileBase = FileBase> = (name: string) => PathHook<T>;

export function fileType(fields: (filePath: string) => FileFields): FileType {
  return (name: string) => {
    return (parent: Parent) => {
      const pathFields = path(parent, name);
      return {
        ...pathFields,
        exists: (options?: FileExistsOptions) => fileExists(pathFields.path, options),
        remove: () => removeFile(pathFields.path),
        watch: () => watchFile(pathFields.path),
        ...fields(pathFields.path)
      };
    };
  };
}

import file from "./file";
import jsonFile from "./json";
import packageJSONFile from "./package-json";
import tsConfigJSONFile from "./tsconfig-json";
import markdownFile from "./markdown";
import lcovFile from "./lcov";

export { FileHook, File, Content } from "./file";

export {
  file,
  jsonFile,
  packageJSONFile,
  tsConfigJSONFile,
  markdownFile,
  lcovFile
};
