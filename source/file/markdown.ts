import { readMarkdown, TokensList } from "read-md-safe";
import { writeMarkdown, MarkdownContent } from "write-md-safe";
import { fileType, FileBase, FileType } from ".";

export interface MarkdownFile extends FileBase {
  read: () => Promise<TokensList | undefined>;
  write: (content?: MarkdownContent) => Promise<boolean | undefined>;
}

const markdownFile = fileType((filePath: string) => ({
  read: readMarkdown(filePath),
  write: (content?: MarkdownContent) => writeMarkdown(filePath, content)
}));

export default markdownFile as FileType<MarkdownFile>;
