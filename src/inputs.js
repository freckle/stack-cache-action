const core = require("@actions/core");

module.exports = {
  getStackYaml: () => core.getInput("stack-yaml", { required: true }),

  getWorkingDirectory: () =>
    core.getInput("working-directory", { required: true }),

  getPrefix: () => core.getInput("prefix", { required: false }),
};
