const assert = require("assert");
const path = require("path");
const process = require("process");
const stackCache = require("../src/stack-cache.js");

async function inExample(fn) {
  const cwd = process.cwd();
  process.chdir("example");

  try {
    const ret = await fn();
    process.chdir(cwd);
    return ret;
  } catch (ex) {
    process.chdir(cwd);
    throw ex;
  }
}

// "a-b-c-" -> ["a","b","c"]
function cacheParts(key) {
  return key.split("-").filter(p => p.length !== 0);
}

describe("stack-cache", () => {
  describe("#getPrimaryKey()", () => {
    it("returns a key by os/lock/manifests/source", async () => {
      await inExample(async () => {
        const primaryKey = await stackCache.getPrimaryKey("stack.yaml");
        const parts = cacheParts(primaryKey);
        assert.equal(parts.length, 4);
        assert.equal("Linux", parts[0]);
      });
    });
  });

  describe("#getRestoreKeys()", () => {
    it("returns attempts from manifests to lock", async () => {
      await inExample(async () => {
        const restoreKeys = await stackCache.getRestoreKeys("stack.yaml");
        const partLengths = restoreKeys.map(k => cacheParts(k).length);
        assert.deepEqual(partLengths, [3, 2]);
      });
    });
  });

  describe("#getPaths()", () => {
    it("returns all artifact paths", async () => {
      await inExample(async () => {
        const cwd = process.cwd();
        const home = process.env.HOME;
        const cachePaths = await stackCache.getPaths();
        assert.deepEqual(cachePaths, [
          path.join(home, ".stack"),
          path.join(cwd, "package", ".stack-work"),
          path.join(cwd, ".stack-work"),
        ]);
      });
    });
  });
});
