import { directory, Directory, Files } from "./directory";
import merge from "deepmerge";

export interface Root<F extends Files> extends Directory<F> {
  add: <N extends Files>(files: N) => Root<F & N>;
}

function addFiles<F extends Files, N extends Files>(rootDir: Root<F>, newFiles: N): Root<F & N> {
  // eslint-disable-next-line no-underscore-dangle
  const files = merge(rootDir._files, newFiles) as F & N;
  return root(rootDir.path, files);
}

/**
 * Define the root directory of a file structure.
 */
export function root<F extends Files>(path: string, files?: F): Root<F>
export function root<F extends Files>(files?: F): Root<F>
export function root<F extends Files>(a: string | F = {} as F, b: F = {} as F): Root<F> {
  const path = typeof a === "string" ? a : process.cwd();
  const files = typeof a === "object" ? a : b;
  const rootDir = {
    ...directory(path, files)(path),
    add: <N extends Files>(newFiles: N): Root<F & N> => {
      return addFiles(rootDir, newFiles);
    }
  };
  return rootDir;
}
