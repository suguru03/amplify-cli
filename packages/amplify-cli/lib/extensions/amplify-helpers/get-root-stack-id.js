'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getRootStackId = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
function getRootStackId() {
  const teamProviderInfo = amplify_cli_core_1.stateManager.getTeamProviderInfo();
  const { envName } = amplify_cli_core_1.stateManager.getLocalEnvInfo();
  const envTeamProviderInfo = teamProviderInfo[envName];
  if (envTeamProviderInfo && envTeamProviderInfo.awscloudformation) {
    const stackId = envTeamProviderInfo.awscloudformation.StackId;
    return stackId.split('/')[2];
  }
  throw new Error('Root stack Id not found');
}
exports.getRootStackId = getRootStackId;
//# sourceMappingURL=get-root-stack-id.js.map
