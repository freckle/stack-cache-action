const crypto = require("crypto");
const exec = require("@actions/exec");
const fs = require("fs");
const glob = require("@actions/glob");

async function uname() {
  let output = "";
  const options = {};
  options.listeners = {
    stdout: data => {
      output += data.toString();
    },
  };
  await exec.exec("uname", [], options);

  return output.trim();
}

async function globAll(patterns) {
  const globber = await glob.create(patterns.join("\n"));
  return globber.glob();
}

async function hashFiles(paths) {
  const contents = paths.map(path => fs.readFileSync(path));
  const shasum = crypto.createHash("sha1");
  shasum.update(`${contents.join("")}`);
  return shasum.digest("hex");
}

module.exports.uname = uname;
module.exports.globAll = globAll;
module.exports.hashFiles = hashFiles;
