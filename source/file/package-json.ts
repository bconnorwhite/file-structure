import { PackageJSON, fileName } from "types-pkg-json";
import { jsonFileType } from "./json";

export default function packageJSONFile(name: string = fileName) {
  return jsonFileType<PackageJSON>(name);
}
