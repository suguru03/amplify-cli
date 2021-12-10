'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getProjectDetails = void 0;
const get_env_info_1 = require('./get-env-info');
const amplify_cli_core_1 = require('amplify-cli-core');
function getProjectDetails() {
  const projectConfig = amplify_cli_core_1.stateManager.getProjectConfig();
  let amplifyMeta = {};
  if (amplify_cli_core_1.stateManager.metaFileExists()) {
    amplifyMeta = amplify_cli_core_1.stateManager.getMeta();
  }
  const localEnvInfo = get_env_info_1.getEnvInfo();
  let teamProviderInfo = {};
  if (amplify_cli_core_1.stateManager.teamProviderInfoExists()) {
    teamProviderInfo = amplify_cli_core_1.stateManager.getTeamProviderInfo();
  }
  return {
    projectConfig,
    amplifyMeta,
    localEnvInfo,
    teamProviderInfo,
  };
}
exports.getProjectDetails = getProjectDetails;
//# sourceMappingURL=get-project-details.js.map
