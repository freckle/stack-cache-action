const cache = require("@actions/cache");
const core = require("@actions/core");
const inputs = require("./inputs.js");
const state = require("./state.js");
const stackCache = require("./stack-cache.js");

async function run() {
  const stackYaml = inputs.getStackYaml();
  const workingDirectory = inputs.getWorkingDirectory();
  process.chdir(workingDirectory);

  const primaryKey = await stackCache.getPrimaryKey(stackYaml);
  core.info(`Primary key: ${primaryKey}`);
  const restoreKeys = await stackCache.getRestoreKeys(stackYaml);
  core.info(`Restore keys: ${restoreKeys.join(", ")}`);
  const cachePaths = await stackCache.getPaths();
  core.info(`Cache paths: ${cachePaths.join(", ")}`);

  state.savePrimaryKey(primaryKey);
  state.saveCachePaths(cachePaths);

  const restoredKey = await cache.restoreCache(
    cachePaths,
    primaryKey,
    restoreKeys
  );

  state.saveRestoredKey(restoredKey);

  if (!restoredKey) {
    core.info("Cache not found");
    return;
  }

  const isExactKeyMatch = primaryKey === restoredKey;
  core.setOutput("cache-hit", isExactKeyMatch.toString());
  core.info(`Cache restored from key: ${restoredKey}`);
}

run().catch(err => {
  core.setFailed(err.toString());
});
