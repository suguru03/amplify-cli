'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.initializeEnv = void 0;
const lodash_1 = __importDefault(require('lodash'));
const ora_1 = __importDefault(require('ora'));
const promise_sequential_1 = __importDefault(require('promise-sequential'));
const amplify_cli_core_1 = require('amplify-cli-core');
const get_provider_plugins_1 = require('./extensions/amplify-helpers/get-provider-plugins');
const spinner = ora_1.default('');
async function initializeEnv(context, currentAmplifyMeta) {
  const currentEnv = context.exeInfo.localEnvInfo.envName;
  const isPulling = context.input.command === 'pull' || (context.input.command === 'env' && context.input.subCommands[0] === 'pull');
  try {
    const { projectPath } = context.exeInfo.localEnvInfo;
    const amplifyMeta = {};
    const teamProviderInfo = amplify_cli_core_1.stateManager.getTeamProviderInfo(projectPath);
    amplifyMeta.providers = lodash_1.default.pick(teamProviderInfo[currentEnv], 'awscloudformation');
    if (!currentAmplifyMeta) {
      if (amplify_cli_core_1.stateManager.currentMetaFileExists()) {
        currentAmplifyMeta = amplify_cli_core_1.stateManager.getCurrentMeta();
      }
    }
    if (!context.exeInfo.restoreBackend) {
      populateAmplifyMeta(projectPath, amplifyMeta);
    }
    const categoryInitializationTasks = [];
    const initializedCategories = Object.keys(amplify_cli_core_1.stateManager.getMeta());
    const categoryPluginInfoList = context.amplify.getAllCategoryPluginInfo(context);
    const availableCategories = Object.keys(categoryPluginInfoList).filter(key => initializedCategories.includes(key));
    availableCategories.forEach(category => {
      categoryPluginInfoList[category].forEach(pluginInfo => {
        try {
          const { initEnv } = require(pluginInfo.packageLocation);
          if (initEnv) {
            categoryInitializationTasks.push(() => initEnv(context));
          }
        } catch (e) {
          context.print.warning(`Could not load initEnv for ${category}`);
        }
      });
    });
    const providerPlugins = get_provider_plugins_1.getProviderPlugins(context);
    const initializationTasks = [];
    const providerPushTasks = [];
    context.exeInfo.projectConfig.providers.forEach(provider => {
      const providerModule = require(providerPlugins[provider]);
      initializationTasks.push(() => providerModule.initEnv(context, amplifyMeta.providers[provider]));
    });
    spinner.start(
      isPulling ? `Fetching updates to backend environment: ${currentEnv} from the cloud.` : `Initializing your environment: ${currentEnv}`,
    );
    try {
      await promise_sequential_1.default(initializationTasks);
    } catch (e) {
      context.print.error(`Could not initialize '${currentEnv}': ${e.message}`);
      context.usageData.emitError(e);
      process.exit(1);
    }
    spinner.succeed(
      isPulling ? `Successfully pulled backend environment ${currentEnv} from the cloud.` : 'Initialized provider successfully.',
    );
    const projectDetails = context.amplify.getProjectDetails();
    context.exeInfo = context.exeInfo || {};
    Object.assign(context.exeInfo, projectDetails);
    await promise_sequential_1.default(categoryInitializationTasks);
    if (context.exeInfo.forcePush === undefined) {
      context.exeInfo.forcePush = await context.amplify.confirmPrompt(
        'Do you want to push your resources to the cloud for your environment?',
      );
    }
    if (context.exeInfo.forcePush) {
      for (let provider of context.exeInfo.projectConfig.providers) {
        const providerModule = require(providerPlugins[provider]);
        const resourceDefiniton = await context.amplify.getResourceStatus(undefined, undefined, provider);
        providerPushTasks.push(() => providerModule.pushResources(context, resourceDefiniton));
      }
      await promise_sequential_1.default(providerPushTasks);
    }
    await context.amplify.onCategoryOutputsChange(context, currentAmplifyMeta);
    context.print.success(isPulling ? '' : 'Initialized your environment successfully.');
  } catch (e) {
    spinner.fail('There was an error initializing your environment.');
    throw e;
  }
}
exports.initializeEnv = initializeEnv;
function populateAmplifyMeta(projectPath, amplifyMeta) {
  const backendConfig = amplify_cli_core_1.stateManager.getBackendConfig(projectPath);
  Object.assign(amplifyMeta, backendConfig);
  amplify_cli_core_1.stateManager.setMeta(projectPath, amplifyMeta);
}
//# sourceMappingURL=initialize-env.js.map
