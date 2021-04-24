const cache = require("@actions/cache");
const core = require("@actions/core");
const inputs = require("./inputs.js");
const state = require("./state.js");

async function run() {
  const cacheKey = state.getCacheResult();
  const primaryKey = state.getCacheKey();
  const cachePaths = await inputs.getCachePaths();

  if (cacheKey === primaryKey) {
    core.info(
      `Cache hit occurred on the primary key ${primaryKey}, not saving cache.`
    );
    return;
  }

  // https://github.com/actions/cache/blob/9ab95382c899bf0953a0c6c1374373fc40456ffe/src/save.ts#L39-L49
  try {
    await cache.saveCache(cachePaths, primaryKey);
  } catch (error) {
    if (error.name === cache.ValidationError.name) {
      throw error;
    } else if (error.name === cache.ReserveCacheError.name) {
      core.info(error.message);
    } else {
      core.info(`[warning] ${error.message}`);
    }
  }
}

run().catch(err => {
  core.setFailed(err.toString());
});
