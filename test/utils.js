const assert = require("assert");
const utils = require("../src/utils.js");

describe("utils", () => {
  describe("#uname()", () => {
    it('should return "Linux"', async () => {
      const os = await utils.uname();
      assert.equal(os, "Linux");
    });
  });

  describe("#hashFiles()", () => {
    it("hashes all the files", async () => {
      // find test/fixtures -type f | sort | xargs cat | sha1sum -
      // d1bee39248d5ac65f9d33fc54bd9f71626099a26
      const paths = await utils.globAll(["test/fixtures/**/*.js"]);
      const md5sum = await utils.hashFiles(paths);
      assert.equal(md5sum, "d1bee39248d5ac65f9d33fc54bd9f71626099a26");
    });
  });
});
