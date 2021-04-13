import {
  JSONObject,
  writeJSON,
  WriteJSONOptions,
  readJSONObject,
  mergeJSON
} from "fs-safe";
import { fileType, FileBase, FileType, FileBaseHook } from "./";

export interface JSONFile<T extends JSONObject = JSONObject> extends FileBase {
  read: () => Promise<T | undefined>;
  write: (content: T, options?: WriteJSONOptions) => Promise<boolean>;
  merge: (value: T) => Promise<boolean | undefined>;
}

export type JSONFileHook<T extends JSONObject> = FileBaseHook<JSONFile<T>>;

const jsonFile = fileType(<T extends JSONObject = JSONObject>(filePath: string) => ({
  read: () => readJSONObject(filePath) as Promise<T | undefined>,
  write: (content: T, options?: WriteJSONOptions) => writeJSON(filePath, content, options),
  merge: (object: T) => mergeJSON(filePath, object)
}));


export function jsonFileType<T extends JSONObject>(filePath: string) {
  return jsonFile(filePath) as JSONFileHook<T>;
}

export default jsonFile as FileType<JSONFile>;

export {
  JSONObject,
  WriteJSONOptions
};
