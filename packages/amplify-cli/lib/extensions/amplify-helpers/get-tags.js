'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getTags = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
function getTags(context) {
  let tags;
  let envInfo;
  let projectConfig;
  if (amplify_cli_core_1.stateManager.isTagFilePresent()) {
    tags = amplify_cli_core_1.stateManager.getProjectTags();
  } else {
    tags = initialTags;
  }
  if (amplify_cli_core_1.stateManager.localEnvInfoExists() && amplify_cli_core_1.stateManager.projectConfigExists()) {
    envInfo = amplify_cli_core_1.stateManager.getLocalEnvInfo();
    projectConfig = amplify_cli_core_1.stateManager.getProjectConfig();
  } else {
    envInfo = context.exeInfo.localEnvInfo;
    projectConfig = context.exeInfo.projectConfig;
  }
  const { envName } = envInfo;
  const { projectName } = projectConfig;
  return amplify_cli_core_1.HydrateTags(tags, { envName, projectName });
}
exports.getTags = getTags;
const initialTags = [
  {
    Key: 'user:Stack',
    Value: '{project-env}',
  },
  {
    Key: 'user:Application',
    Value: '{project-name}',
  },
];
//# sourceMappingURL=get-tags.js.map
