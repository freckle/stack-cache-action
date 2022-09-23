const core = require("@actions/core");
const os = require("os");
const path = require("path");
const process = require("process");
const inputs = require("./inputs.js");
const stackCache = require("./stack-cache.js");

jest.mock("./inputs.js");

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

describe("stackCache", () => {
  beforeAll(() => {
    jest.spyOn(core, "debug").mockImplementation();
    jest.spyOn(core, "info").mockImplementation();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getCacheKeys", () => {
    it("returns a primary key and two fallbacks", async () => {
      await inExample(async () => {
        const keys = await stackCache.getCacheKeys("stack.yaml");
        expect(keys.length).toBe(3);

        const [primaryKey, restoreKey1, restoreKey2] = keys;
        const primaryKeyParts = cacheParts(primaryKey);
        const restoreKeyParts1 = cacheParts(restoreKey1);
        const restoreKeyParts2 = cacheParts(restoreKey2);

        expect(primaryKeyParts.length).toBe(4); // os-lock-manifest-source
        expect(restoreKeyParts1[0]).toBe(primaryKeyParts[0]); // os
        expect(restoreKeyParts1[1]).toBe(primaryKeyParts[1]); // lock
        expect(restoreKeyParts1[2]).toBe(primaryKeyParts[2]); // manifest
        expect(restoreKeyParts2[3]).toBeUndefined();
        expect(restoreKeyParts2[0]).toBe(primaryKeyParts[0]); // os
        expect(restoreKeyParts2[1]).toBe(primaryKeyParts[1]); // lock
        expect(restoreKeyParts2[2]).toBeUndefined();
      });
    });

    it("respects prefix inputs", async () => {
      await inExample(async () => {
        const prefix = "some-prefix-";
        inputs.getPrefix.mockReturnValue(prefix);
        const prefixedKeys = await stackCache.getCacheKeys("stack.yaml");

        inputs.getPrefix.mockReturnValue("");
        const keys = await stackCache.getCacheKeys("stack.yaml");

        expect(prefixedKeys).toEqual(keys.map(key => prefix + key));
      });
    });
  });

  describe("getPaths", () => {
    it("stackCache.getPaths returns all artifact paths", async () => {
      await inExample(async () => {
        const cwd = process.cwd();
        const home = os.homedir();
        const cachePaths = await stackCache.getPaths();
        expect(cachePaths).toStrictEqual([
          path.join(home, ".stack"),
          path.join(cwd, "package", ".stack-work"),
          path.join(cwd, ".stack-work"),
        ]);
      });
    });
  });
});
