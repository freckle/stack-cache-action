const crypto = require("crypto");
const exec = require("@actions/exec");
const fs = require("fs");
const glob = require("@actions/glob");

async function readProcess(cmd, args = []) {
  let output = "";
  const options = {
    silent: true,
    listeners: {
      stdout: data => {
        output += data.toString();
      },
    },
  };

  await exec.exec(cmd, args, options);

  return output.trim();
}

module.exports = {
  uname: async () => readProcess("uname"),

  git: async (cmd, args = []) => readProcess("git", [cmd].concat(args)),

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
