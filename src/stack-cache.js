const path = require("path");
const utils = require("./utils.js");

const MANIFEST_PATTERNS = ["**/*.cabal", "**/package.yaml"];

async function getManifestPaths() {
  return utils.globAll(MANIFEST_PATTERNS);
}

module.exports = {
  getCacheKeys: async stackYaml => {
    const os = await utils.uname();
    const lockPath = `${stackYaml}.lock`;
    const lockHash = await utils.hashFiles([lockPath]);
    const manifestPaths = await getManifestPaths();
    const manifestHash = await utils.hashFiles(manifestPaths);
    const gitLsFiles = await utils.git("ls-files", ["."]);
    const sourceHash = await utils.hashFiles(gitLsFiles.split("\n"));

    return [
      `${os}-${lockHash}-${manifestHash}-${sourceHash}`,
      `${os}-${lockHash}-${manifestHash}-`,
      `${os}-${lockHash}-`,
    ];
  },

  getPaths: async () => {
    const manifestPaths = await getManifestPaths();
    const stackHome = path.join(process.env.HOME, ".stack");
    const stackWorks = manifestPaths.map(p =>
      path.join(path.dirname(p), ".stack-work")
    );
    return [stackHome].concat(stackWorks);
  },
};
