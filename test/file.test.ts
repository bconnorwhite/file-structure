import { test, expect, beforeEach, afterEach } from "@jest/globals";
import mock, { restore } from "mock-fs";
import { promises } from "fs";
import { getExecutableMode } from "make-executable";
import { file, root, markdownFile, lcovFile, jsonFile } from "../source";

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
    file: file("file")
  });
  const exists = await dir.files().file.exists();
  expect(exists).toBe(true);
  done?.();
});

test("read", async (done) => {
  const dir = root("/test", {
    file: file("file")
  });
  const content = await dir.files().file.read();
  expect(content).toBe("hello world!");
  done?.();
});

test("read buffer", async (done) => {
  const dir = root("/test", {
    file: file("file")
  });
  const content = await dir.files().file.read({ buffer: true });
  expect(content?.toString()).toBe("hello world!");
  done?.();
});

test("remove", async (done) => {
  const dir = root("/test", {
    file: file("file")
  });
  const success = await dir.files().file.remove();
  expect(success).toBe(true);
  const removed = await dir.files().file.read();
  expect(removed).toBe(undefined);
  done?.();
});

test("watch", async (done) => {
  const dir = root("/test", {
    file: file("file")
  });
  const watcher = dir.files().file.watch().onReady(() => {
    watcher.stop();
    done?.();
  });
});

test("make executable", async (done) => {
  const dir = root("/test", {
    file: file("file")
  });
  const result = await dir.files().file.makeExecutable();
  expect(result).toBe(true);
  promises.stat(dir.files().file.path).then((stats) => {
    expect(stats.mode & getExecutableMode()).toBe(getExecutableMode());
    done?.();
  });
});

test("json read", async (done) => {
  const dir = root("/test", {
    file: markdownFile("file"),
    json: jsonFile("json")
  });
  const writeSuccess = await dir.files().json.write({ test: "hello" });
  expect(writeSuccess).toBe(true);
  const content = await dir.files().json.read();
  expect(content).toEqual({ test: "hello" });
  const mergeSuccess = await dir.files().json.merge({ test2: "world" });
  expect(mergeSuccess).toBe(true);
  const content2 = await dir.files().json.read();
  expect(content2).toEqual({ test: "hello", test2: "world" });
  done?.();
});

test("markdown", async (done) => {
  const dir = root("/test", {
    file: markdownFile("file")
  });
  const success = await dir.files().file.write("# Title");
  expect(success).toBe(true);
  const content = await dir.files().file.read();
  expect(content?.[0].raw).toBe("# Title\n");
  done?.();
});

test("lcov", async (done) => {
  const dir = root("/test", {
    file: lcovFile("file")
  });
  const success = await dir.files().file.write("end_of_record");
  expect(success).toBe(true);
  const content = await dir.files().file.read();
  expect(content?.[0].branches.found).toBe(0);
  done?.();
});
