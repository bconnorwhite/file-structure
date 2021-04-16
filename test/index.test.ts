import { test, expect } from "@jest/globals";
import { root, directory, file, jsonFile, packageJSONFile, tsConfigJSONFile, lcovFile, markdownFile } from "../source";

test("empty root", () => {
  const structure = root();
  expect(structure.files()).toEqual({});
});

test("root with path", () => {
  const structure = root("/test");
  expect(structure.path).toEqual("/test");
});

test("files", () => {
  const structure = root({
    file: file("file.txt"),
    json: jsonFile("file.json"),
    packageJSON: packageJSONFile(),
    tsConfig: tsConfigJSONFile(),
    readme: markdownFile("README.md"),
    coverage: directory("coverage", {
      lcov: lcovFile("lcov.info")
    })
  });
  expect(structure.relative).toBe("");
  expect(structure.files().coverage.relative).toBe("coverage");
});

test("add files", () => {
  const structure = root({});
  const structure2 = structure.add({
    file: file("file.txt")
  });
  expect(structure2.files().file.relative).toEqual("file.txt");
});

test("file", () => {
  const structure = root({});
  const subfile = structure.file("test.txt");
  expect(subfile.relative).toEqual("test.txt");
});

test("empty subdirectory", () => {
  const structure = root({});
  const subdirectory = structure.subdirectory("test");
  expect(subdirectory.relative).toEqual("test");
});

test("subdirectory", () => {
  const structure = root({});
  const subdirectory = structure.subdirectory("test", {
    test: file("file.txt")
  });
  expect(subdirectory.files().test.relative).toEqual("test/file.txt");
});
