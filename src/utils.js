const crypto = require("crypto");
const exec = require("@actions/exec");
const fs = require("fs");
const glob = require("@actions/glob");

module.exports = {
  uname: async () => {
    let output = "";
    const options = {};
    options.listeners = {
      stdout: data => {
        output += data.toString();
      },
    };
    await exec.exec("uname", [], options);

    return output.trim();
  },

  globAll: async patterns => {
    const globber = await glob.create(patterns.join("\n"));
    return globber.glob();
  },

  hashFiles: async paths => {
    const contents = paths.map(path => {
      if (fs.lstatSync(path).isFile()) {
        return fs.readFileSync(path);
      }
      return "";
    });
    const shasum = crypto.createHash("sha1");
    shasum.update(`${contents.join("")}`);
    return shasum.digest("hex");
  },
};
