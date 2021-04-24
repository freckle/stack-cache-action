const core = require("@actions/core");

module.exports = {
  savePrimaryKey: x => {
    return core.saveState("STACK_CACHE_PRIMARY_KEY", x);
  },

  getPrimaryKey: () => {
    return core.getState("STACK_CACHE_PRIMARY_KEY");
  },

  saveRestoredKey: x => {
    return core.saveState("STACK_CACHE_RESTORED_KEY", x);
  },

  getRestoredKey: () => {
    return core.getState("STACK_CACHE_RESTORED_KEY");
  },

  saveCachePaths: x => {
    return core.saveState("STACK_CACHE_PATHS", x.join("\n"));
  },

  getCachePaths: () => {
    return core.getState("STACK_CACHE_PATHS").split("\n");
  },
};
