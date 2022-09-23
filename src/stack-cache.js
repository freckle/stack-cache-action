const os = require("os");
const path = require("path");
const utils = require("./utils.js");
const inputs = require("./inputs.js");

const MANIFEST_PATTERNS = ["**/*.cabal", "**/package.yaml"];

async function getLockOrSelf(path) {
  const paths = await utils.globAll([`${path}.lock`, path]);

  if (paths === null || paths === undefined || paths.length === 0) {
    throw new Error(`Neither ${path}.lock nor ${path} exist`);
  }

  return paths[0];
}

async function getManifestPaths() {
  return utils.globAll(MANIFEST_PATTERNS);
}

module.exports = {
  getCacheKeys: async stackYaml => {
    const prefix = inputs.getPrefix();
    const os = await utils.uname();
    const lockPath = await getLockOrSelf(stackYaml);
    const lockHash = await utils.hashFiles([lockPath]);
    const manifestPaths = await getManifestPaths();
    const manifestHash = await utils.hashFiles(manifestPaths);
    const gitLsFiles = await utils.git("ls-files", ["."]);
    const sourceHash = await utils.hashFiles(gitLsFiles.split("\n"));

    return [
      `${prefix}${os}-${lockHash}-${manifestHash}-${sourceHash}`,
      `${prefix}${os}-${lockHash}-${manifestHash}-`,
      `${prefix}${os}-${lockHash}-`,
    ];
  },

  getPaths: async () => {
    const manifestPaths = await getManifestPaths();
    const stackHome = path.join(os.homedir(), ".stack");
    const stackWorks = manifestPaths.map(p =>
      path.join(path.dirname(p), ".stack-work")
    );
    return [stackHome].concat(stackWorks);
  },
};
