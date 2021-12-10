'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getAllEnvs = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
function getAllEnvs() {
  let allEnvs = [];
  const envInfo = amplify_cli_core_1.stateManager.getTeamProviderInfo(undefined, {
    throwIfNotExist: false,
    default: {},
  });
  allEnvs = Object.keys(envInfo);
  return allEnvs;
}
exports.getAllEnvs = getAllEnvs;
//# sourceMappingURL=get-all-envs.js.map
