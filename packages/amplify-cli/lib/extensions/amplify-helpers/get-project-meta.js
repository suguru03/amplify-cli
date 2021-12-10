'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getProjectMeta = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
function getProjectMeta() {
  if (!amplify_cli_core_1.stateManager.metaFileExists()) {
    throw new amplify_cli_core_1.NotInitializedError();
  }
  return amplify_cli_core_1.stateManager.getMeta();
}
exports.getProjectMeta = getProjectMeta;
//# sourceMappingURL=get-project-meta.js.map
