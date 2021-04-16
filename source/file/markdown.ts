import { readMarkdown, TokensList } from "read-md-safe";
import { writeMarkdown, MarkdownContent, Options } from "write-md-safe";
import { fileType, FileBase, FileType } from ".";

export interface MarkdownFile extends FileBase {
  read: () => Promise<TokensList | undefined>;
  write: (content?: MarkdownContent) => Promise<boolean | undefined>;
}

const markdownFile = fileType((filePath: string) => ({
  read: () => readMarkdown(filePath),
  write: (content?: MarkdownContent, options?: Options | undefined) => writeMarkdown(filePath, content, options)
}));

export default markdownFile as FileType<MarkdownFile>;
