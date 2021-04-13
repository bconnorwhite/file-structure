import { resolve, relative } from "path";

export type Parent = string | Path;

export type Path = {
  root: string;
  directory: Parent;
  name: string;
  path: string;
  relative: string;
} & {
  [fieldName: string]: any;
};

export type PathHook<T extends Path = Path> = (parent: Parent) => T;

function getRoot(directory: Parent) {
  if(typeof directory === "string") {
    return directory;
  } else {
    return directory.root;
  }
}

function getPath(directory: Parent, name: string) {
  if(typeof directory === "string") {
    return resolve(directory, name);
  } else {
    return resolve(directory.path, name);
  }
}

export default function path(directory: Parent, name: string) {
  const root = getRoot(directory);
  const fullPath = getPath(directory, name);
  return {
    root,
    directory,
    name,
    path: fullPath,
    relative: relative(root, fullPath)
  };
}
