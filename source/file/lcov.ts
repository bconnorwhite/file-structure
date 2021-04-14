import { readLCOV, LCOVRecord } from "read-lcov-safe";
import { writeFile } from "fs-safe";
import { fileType, FileBase, FileType } from ".";

export interface LCOVFile extends FileBase {
  read: () => Promise<LCOVRecord[] | undefined>;
  write: (content?: string) => Promise<boolean | undefined>;
}

const markdownFile = fileType((filePath: string) => ({
  read: () => readLCOV(filePath),
  write: (content?: string) => writeFile(filePath, content)
}));

export default markdownFile as FileType<LCOVFile>;
