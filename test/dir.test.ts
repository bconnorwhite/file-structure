import { test, expect, beforeEach, afterEach } from "@jest/globals";
import mock, { restore } from "mock-fs";
import { directory, file, root } from "../source";

beforeEach(() => {
  mock({
    "/test": {
      file: "hello world!"
    }
  });
});

afterEach(restore);

test("exists", async (done) => {
  const dir = root("/test", {
    sub: directory("sub"),
    file: file("file")
  });
  const testExists = await dir.exists();
  expect(testExists).toBe(true);
  done?.();
});

test("read", async (done) => {
  const dir = root("/test", {
    file: file("file")
  });
  const contents = await dir.read();
  expect(contents).toEqual(["file"]);
  done?.();
});

test("write, remove", async (done) => {
  const dir = root("/test", {
    sub: directory("sub"),
    file: file("file")
  });
  const writeResult = await dir.files().sub.write();
  expect(writeResult).toBe(true);
  const contentsAfterWrite = await dir.read({ includeDirectories: true });
  expect(contentsAfterWrite).toEqual(["file", "sub"]);
  const removeResult = await dir.files().sub.remove();
  expect(removeResult).toBe(true);
  const contents = await dir.read({ includeDirectories: true });
  expect(contents).toEqual(["file"]);
  done?.();
});

test("watch", async (done) => {
  const dir = root("/test");
  const watcher = dir.watch().onReady(() => {
    watcher.stop();
    done?.();
  });
});

test("writeFiles", async (done) => {
  const dir = root("/test");
  await dir.writeFiles({
    "a.txt": "a test",
    "b": {
      "c.txt": "c test"
    }
  });
  const dirWithFiles = dir.add({
    a: file("a.txt"),
    b: directory("b", {
      c: file("c.txt")
    })
  });
  const a = await dirWithFiles.files().a.read();
  expect(a).toBe("a test\n");
  const c = await dirWithFiles.files().b.files().c.read();
  expect(c).toBe("c test\n");
  done?.();
});
