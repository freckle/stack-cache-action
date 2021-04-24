const core = require("@actions/core");

module.exports = {
  getStackYaml: () => {
    return core.getInput("stack-yaml", { required: true });
  },

  getWorkingDirectory: () => {
    return core.getInput("working-directory", { required: true });
  },
};
