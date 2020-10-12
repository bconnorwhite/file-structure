import { TSConfigJSON, fileName } from "types-tsconfig";
import { jsonFileType } from "./json";

export default function tsConfigJSONFile(name: string = fileName) {
  return jsonFileType<TSConfigJSON>(name);
}
