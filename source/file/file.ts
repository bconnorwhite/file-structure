import {
  readFile,
  ReadFileOptions,
  writeFile,
  WriteFileOptions,
  makeExecutable
} from "fs-safe";
import { ReturnValue, Args } from "read-file-safe";
import { fileType, FileBase, FileType, FileBaseHook } from "./";

export interface File extends FileBase {
  read: <T extends Args>(...[options]: T) => Promise<ReturnValue<T>>;
  write: () => Promise<boolean | undefined>;
  makeExecutable: () => Promise<boolean | undefined>;
}

export type FileHook = FileBaseHook<File>;

function useBuffer(options: ReadFileOptions<boolean>): options is ReadFileOptions<true> {
  return options.buffer === true;
}

function read(filePath: string) {
  return function readGeneric<T extends Args>(...[options = {}]: T) {
    return (useBuffer(options) ? readFile(filePath, options) : readFile(filePath, options)) as Promise<ReturnValue<T>>;
  };
}

const file = fileType((filePath: string) => ({
  read: read(filePath),
  write: (content?: string | Buffer, options?: WriteFileOptions) => writeFile(filePath, content, options),
  makeExecutable: () => makeExecutable(filePath)
}));

export default file as FileType<File>;
