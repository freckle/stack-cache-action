const core = require("@actions/core");
const path = require("path");
const utils = require("./utils.js");

const MANIFEST_PATTERNS = ["**/*.cabal", "**/package.yaml"];

async function getCacheKeys(stackYaml) {
  const os = await utils.uname();
  const lockPath = `${stackYaml}.lock`;
  const lockHash = await utils.hashFiles([lockPath]);
  const manifestPaths = await getManifestPaths();
  const manifestHash = await utils.hashFiles(manifestPaths);
  const sourcePaths = await utils.globAll(["**/*"]);
  const sourceHash = await utils.hashFiles(sourcePaths);

  return [
    `${os}-${lockHash}-${manifestHash}-${sourceHash}`,
    `${os}-${lockHash}-${manifestHash}-`,
    `${os}-${lockHash}-`,
  ];
}

async function getManifestPaths() {
  return utils.globAll(MANIFEST_PATTERNS);
}

module.exports = {
  getPrimaryKey: async stackYaml => {
    const keys = await getCacheKeys(stackYaml);
    return keys[0];
  },

  getRestoreKeys: async stackYaml => {
    const keys = await getCacheKeys(stackYaml);
    return keys.slice(1);
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
