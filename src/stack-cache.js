const os = require("os");
const path = require("path");
const process = require("process");
const utils = require("./utils.js");
const inputs = require("./inputs.js");

const MANIFEST_PATTERNS = ["**/*.cabal", "**/package.yaml"];

async function getLockOrSelf(p) {
  const paths = await utils.globAll([`${p}.lock`, p]);

  if (paths === null || paths === undefined || paths.length === 0) {
    throw new Error(`Neither ${p}.lock nor ${p} exist`);
  }

  return paths[0];
}

async function getManifestPaths() {
  return utils.globAll(MANIFEST_PATTERNS);
}

function unique(items) {
  return Array.from(new Set(items));
}

module.exports = {
  getCacheKeys: async stackYaml => {
    const prefix = inputs.getPrefix();
    const uname = await utils.uname();
    const lockPath = await getLockOrSelf(stackYaml);
    const lockHash = await utils.hashFiles([lockPath]);
    const manifestPaths = await getManifestPaths();
    const manifestHash = await utils.hashFiles(manifestPaths);
    const gitLsFiles = await utils.git("ls-files", ["."]);
    const sourceHash = await utils.hashFiles(gitLsFiles.split("\n"));

    return [
      `${prefix}${uname}-${lockHash}-${manifestHash}-${sourceHash}`,
      `${prefix}${uname}-${lockHash}-${manifestHash}-`,
      `${prefix}${uname}-${lockHash}-`,
    ];
  },

  getPaths: async () => {
    // All of these need to be cached:
    //
    // - ~/.stack
    // - ./.stack-work
    // - ./{package}/.stack-work
    //
    const manifestPaths = await getManifestPaths();
    const stackHome = path.join(os.homedir(), ".stack");
    const stackWork = path.join(process.cwd(), ".stack-work");
    const stackWorks = manifestPaths.map(p =>
      path.join(path.dirname(p), ".stack-work")
    );
    return unique([stackHome, stackWork].concat(stackWorks));
  },
};
