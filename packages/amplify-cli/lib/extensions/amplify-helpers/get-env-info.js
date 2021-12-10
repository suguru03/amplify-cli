'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getEnvInfo = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
class UndeterminedEnvironmentError extends Error {
  constructor() {
    super(
      "Current environment cannot be determined\nUse 'amplify init' in the root of your app directory to initialize your project with Amplify",
    );
    this.name = 'UndeterminedEnvironmentError';
    this.stack = undefined;
  }
}
function getEnvInfo() {
  if (amplify_cli_core_1.stateManager.localEnvInfoExists()) {
    return amplify_cli_core_1.stateManager.getLocalEnvInfo();
  } else {
    throw new UndeterminedEnvironmentError();
  }
}
exports.getEnvInfo = getEnvInfo;
//# sourceMappingURL=get-env-info.js.map
