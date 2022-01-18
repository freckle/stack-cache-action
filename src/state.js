const core = require("@actions/core");

module.exports = {
  savePrimaryKey: x => core.saveState("STACK_CACHE_PRIMARY_KEY", x),

  getPrimaryKey: () => core.getState("STACK_CACHE_PRIMARY_KEY"),

  saveRestoredKey: x => core.saveState("STACK_CACHE_RESTORED_KEY", x),

  getRestoredKey: () => core.getState("STACK_CACHE_RESTORED_KEY"),

  saveCachePaths: x => core.saveState("STACK_CACHE_PATHS", x.join("\n")),

  getCachePaths: () => core.getState("STACK_CACHE_PATHS").split("\n"),
};
