'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.run = void 0;
const pull_backend_1 = require('../pull-backend');
const pre_deployment_pull_1 = require('../pre-deployment-pull');
const attach_backend_1 = require('../attach-backend');
const amplify_service_helper_1 = require('../amplify-service-helper');
const checkout_1 = require('./env/checkout');
const amplify_cli_core_1 = require('amplify-cli-core');
const lodash_1 = __importDefault(require('lodash'));
const run = async context => {
  const inputParams = amplify_service_helper_1.constructInputParams(context);
  const projectPath = process.cwd();
  if (inputParams.sandboxId) {
    try {
      await pre_deployment_pull_1.preDeployPullBackend(context, inputParams.sandboxId);
    } catch (e) {
      context.print.error(`Failed to pull sandbox app: ${e.message || 'An unknown error occurred.'}`);
    }
    return;
  }
  if (amplify_cli_core_1.stateManager.currentMetaFileExists(projectPath)) {
    const { appId: inputAppId, envName: inputEnvName } = inputParams.amplify;
    const teamProviderInfo = amplify_cli_core_1.stateManager.getTeamProviderInfo(projectPath);
    const { envName } = amplify_cli_core_1.stateManager.getLocalEnvInfo(projectPath);
    const appId = lodash_1.default.get(teamProviderInfo, [envName, 'awscloudformation', 'AmplifyAppId'], false);
    const localEnvNames = Object.keys(teamProviderInfo);
    if (inputAppId && appId && inputAppId !== appId) {
      context.print.error('Amplify appId mismatch.');
      context.print.info(`You are currently working in the amplify project with Id ${appId}`);
      await context.usageData.emitError(new amplify_cli_core_1.AppIdMismatchError());
      process.exit(1);
    } else if (!appId) {
      context.print.error(`Environment '${envName}' not found.`);
      context.print.info(`Try running "amplify env add" to add a new environment.`);
      context.print.info(`If this backend already exists, try restoring its definition in your team-provider-info.json file.`);
      await context.usageData.emitError(new amplify_cli_core_1.EnvironmentDoesNotExistError());
      process.exit(1);
    }
    if (inputEnvName) {
      if (inputEnvName === envName) {
        await pull_backend_1.pullBackend(context, inputParams);
      } else if (localEnvNames.includes(inputEnvName)) {
        context.parameters.options = {};
        context.parameters.first = inputEnvName;
        await checkout_1.run(context);
      } else {
        inputParams.amplify.appId = inputAppId;
        await attach_backend_1.attachBackend(context, inputParams);
      }
    } else {
      await pull_backend_1.pullBackend(context, inputParams);
    }
  } else {
    await attach_backend_1.attachBackend(context, inputParams);
  }
};
exports.run = run;
//# sourceMappingURL=pull.js.map
