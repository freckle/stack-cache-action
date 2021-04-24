const cache = require("@actions/cache");
const core = require("@actions/core");
const inputs = require("./inputs.js");
const state = require("./state.js");
const utils = require("./utils.js");

async function run() {
  const os = await utils.uname();
  const cachePaths = await inputs.getCachePaths();
  const resolverHash = await inputs.getResolverHash();
  const cabalHash = await inputs.getCabalHash();
  const primaryKey = `${os}-${resolverHash}-${cabalHash}`;
  const restoreKey = `${os}-${resolverHash}-`;
  core.info(`Cache keys: ${[primaryKey, restoreKey].join(", ")}`);

  state.saveCacheKey(primaryKey);

  const cacheKey = await cache.restoreCache(cachePaths, primaryKey, [
    restoreKey,
  ]);

  if (!cacheKey) {
    core.info("Cache not found");
    return;
  }

  state.saveCacheResult(cacheKey);
  const isExactKeyMatch = primaryKey === cacheKey;
  core.setOutput("cache-hit", isExactKeyMatch.toString());
  core.info(`Cache restored from key: ${cacheKey}`);
}

run().catch(err => {
  core.setFailed(err.toString());
});
