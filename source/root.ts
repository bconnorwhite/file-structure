import { directory, Directory, Files } from "./directory";

/**
 * Define the root directory of a file structure.
 */
export function root<F extends Files>(path?: string, files?: F): Directory<F>;
export function root<F extends Files>(files?: F): Directory<F>;
export function root<F extends Files>(a: string | F = {} as F, b: F = {} as F): Directory<F> {
  const path = typeof a === "string" ? a : process.cwd();
  const files = typeof a === "object" ? a : b;
  return directory(path, files)(path);
}
