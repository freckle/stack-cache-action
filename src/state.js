const core = require("@actions/core");

function saveCacheResult(x) {
  return core.saveState("STACK_CACHE_RESULT", x);
}

function getCacheResult() {
  return core.getState("STACK_CACHE_RESULT");
}

function saveCacheKey(x) {
  return core.saveState("STACK_CACHE_KEY", x);
}

function getCacheKey() {
  return core.getState("STACK_CACHE_KEY");
}

module.exports.saveCacheResult = saveCacheResult;
module.exports.getCacheResult = getCacheResult;
module.exports.saveCacheKey = saveCacheKey;
module.exports.getCacheKey = getCacheKey;
