const core = require("@actions/core");
const utils = require("./utils.js");

describe("utils", () => {
  beforeAll(() => {
    jest.spyOn(core, "debug").mockImplementation();
    jest.spyOn(core, "info").mockImplementation();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("uname", () => {
    test("returns Linux", async () => {
      const os = await utils.uname();
      expect(os).toBe("Linux");
    });
  });

  describe("hashFiles", () => {
    it("hashes all the files", async () => {
      // find test/fixtures -type f | sort | xargs cat | sha1sum -
      // d1bee39248d5ac65f9d33fc54bd9f71626099a26
      const paths = await utils.globAll(["test/fixtures/**/*.js"]);
      const md5sum = await utils.hashFiles(paths);
      expect(md5sum).toBe("d1bee39248d5ac65f9d33fc54bd9f71626099a26");
    });
  });
});
