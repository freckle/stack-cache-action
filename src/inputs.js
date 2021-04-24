const core = require("@actions/core");
const utils = require("./utils.js");

async function getCachePaths() {
  const cachePaths = await utils.globAll(["~/.stack", "**/.stack-work"]);
  core.info(`Cache paths: ${cachePaths.join(", ")}`);
  return cachePaths;
}

async function getResolverHash() {
  const resolverPaths = await utils.globAll(["stack.yaml", "snapshot.yaml"]);
  core.info(`Resolver paths: ${resolverPaths.join(", ")}`);
  return utils.hashFiles(resolverPaths);
}

async function getCabalHash() {
  const cabalPaths = await utils.globAll(["**.cabal"]);
  core.info(`Cabal paths: ${cabalPaths.join(", ")}`);
  return utils.hashFiles(cabalPaths);
}

module.exports.getCachePaths = getCachePaths;
module.exports.getResolverHash = getResolverHash;
module.exports.getCabalHash = getCabalHash;
