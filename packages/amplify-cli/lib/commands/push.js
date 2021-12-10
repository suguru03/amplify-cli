'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.run = void 0;
const promise_sequential_1 = __importDefault(require('promise-sequential'));
const ora_1 = __importDefault(require('ora'));
const amplify_cli_core_1 = require('amplify-cli-core');
const get_provider_plugins_1 = require('../extensions/amplify-helpers/get-provider-plugins');
const spinner = ora_1.default('');
async function syncCurrentCloudBackend(context) {
  context.exeInfo.restoreBackend = false;
  const currentEnv = context.exeInfo.localEnvInfo.envName;
  try {
    const { projectPath } = context.exeInfo.localEnvInfo;
    const amplifyMeta = {};
    const teamProviderInfo = amplify_cli_core_1.stateManager.getTeamProviderInfo(projectPath);
    amplifyMeta.providers = teamProviderInfo[currentEnv];
    const providerPlugins = get_provider_plugins_1.getProviderPlugins(context);
    const pullCurrentCloudTasks = [];
    context.exeInfo.projectConfig.providers.forEach(provider => {
      const providerModule = require(providerPlugins[provider]);
      pullCurrentCloudTasks.push(() => providerModule.initEnv(context, amplifyMeta.providers[provider]));
    });
    spinner.start(`Fetching updates to backend environment: ${currentEnv} from the cloud.`);
    await promise_sequential_1.default(pullCurrentCloudTasks);
    spinner.succeed(`Successfully pulled backend environment ${currentEnv} from the cloud.`);
  } catch (e) {
    spinner.fail(`There was an error pulling the backend environment ${currentEnv}.`);
    throw e;
  }
}
const run = async context => {
  try {
    context.amplify.constructExeInfo(context);
    if (context.parameters.options.force) {
      context.exeInfo.forcePush = true;
    }
    await syncCurrentCloudBackend(context);
    return await context.amplify.pushResources(context);
  } catch (e) {
    if (e.name !== 'InvalidDirectiveError') {
      const message = e.name === 'GraphQLError' ? e.toString() : e.message;
      context.print.error(`An error occurred during the push operation: ${message}`);
    }
    context.usageData.emitError(e);
    amplify_cli_core_1.exitOnNextTick(1);
  }
};
exports.run = run;
//# sourceMappingURL=push.js.map
