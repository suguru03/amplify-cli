'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.pullBackend = void 0;
const initialize_env_1 = require('./initialize-env');
const amplify_service_helper_1 = require('./amplify-service-helper');
const amplify_cli_core_1 = require('amplify-cli-core');
async function pullBackend(context, inputParams) {
  context.exeInfo = context.amplify.getProjectDetails();
  context.exeInfo.inputParams = inputParams;
  context.print.info('');
  context.print.info('Pre-pull status:');
  const hasChanges = await context.amplify.showResourceTable();
  context.print.info('');
  context.exeInfo.forcePush = false;
  context.exeInfo.restoreBackend = !context.exeInfo.inputParams.amplify.noOverride;
  if (hasChanges && context.exeInfo.restoreBackend) {
    context.print.warning('Local changes detected.');
    context.print.warning('Pulling changes from the cloud will override your local changes.');
    if (!context.exeInfo.inputParams.yes) {
      const confirmOverride = await context.amplify.confirmPrompt('Are you sure you would like to continue?', false);
      if (!confirmOverride) {
        context.print.info(`Run an 'amplify push' to update your project upstream.`);
        context.print.info('However, this will override upstream changes to this backend environment with your local changes.');
        context.print.info(
          `To merge local and upstream changes, commit all backend code changes to Git, perform a merge, resolve conflicts, and then run 'amplify push'.`,
        );
        context.usageData.emitSuccess();
        amplify_cli_core_1.exitOnNextTick(0);
      }
    }
  }
  await initialize_env_1.initializeEnv(context);
  ensureBackendConfigFile(context);
  await amplify_service_helper_1.postPullCodegen(context);
  context.print.info('Post-pull status:');
  await context.amplify.showResourceTable();
  context.print.info('');
}
exports.pullBackend = pullBackend;
function ensureBackendConfigFile(context) {
  const { projectPath } = context.exeInfo.localEnvInfo;
  if (!amplify_cli_core_1.stateManager.backendConfigFileExists(projectPath)) {
    amplify_cli_core_1.stateManager.setBackendConfig(projectPath, {});
  }
}
//# sourceMappingURL=pull-backend.js.map
