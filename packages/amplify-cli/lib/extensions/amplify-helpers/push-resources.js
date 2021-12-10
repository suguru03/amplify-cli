'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.storeCurrentCloudBackend = exports.pushResources = void 0;
const get_project_config_1 = require('./get-project-config');
const resource_status_1 = require('./resource-status');
const on_category_outputs_change_1 = require('./on-category-outputs-change');
const initialize_env_1 = require('../../initialize-env');
const get_provider_plugins_1 = require('./get-provider-plugins');
const get_env_info_1 = require('./get-env-info');
const amplify_cli_core_1 = require('amplify-cli-core');
async function pushResources(context, category, resourceName, filteredResources) {
  if (context.parameters.options['iterative-rollback']) {
    if (context.parameters.options.force) {
      throw new Error(
        "'--iterative-rollback' and '--force' cannot be used together. Consider runnning 'amplify push --force' to iteratively rollback and redeploy.",
      );
    }
    context.exeInfo.iterativeRollback = true;
  }
  if (context.parameters.options.env) {
    const envName = context.parameters.options.env;
    const allEnvs = context.amplify.getAllEnvs();
    if (allEnvs.findIndex(env => env === envName) !== -1) {
      context.exeInfo = {};
      context.exeInfo.forcePush = false;
      context.exeInfo.projectConfig = amplify_cli_core_1.stateManager.getProjectConfig(undefined, {
        throwIfNotExist: false,
      });
      context.exeInfo.localEnvInfo = get_env_info_1.getEnvInfo();
      if (context.exeInfo.localEnvInfo.envName !== envName) {
        context.exeInfo.localEnvInfo.envName = envName;
        amplify_cli_core_1.stateManager.setLocalEnvInfo(context.exeInfo.localEnvInfo.projectPath, context.exeInfo.localEnvInfo);
      }
      await initialize_env_1.initializeEnv(context);
    } else {
      const errMessage = "Environment doesn't exist. Please use 'amplify init' to create a new environment";
      context.print.error(errMessage);
      await context.usageData.emitError(new amplify_cli_core_1.EnvironmentDoesNotExistError(errMessage));
      amplify_cli_core_1.exitOnNextTick(1);
    }
  }
  const hasChanges = await resource_status_1.showResourceTable(category, resourceName, filteredResources);
  if (!hasChanges && !context.exeInfo.forcePush) {
    context.print.info('\nNo changes detected');
    return context;
  }
  let continueToPush = context.exeInfo && context.exeInfo.inputParams && context.exeInfo.inputParams.yes;
  if (!continueToPush) {
    if (context.exeInfo.iterativeRollback) {
      context.print.info('The CLI will rollback the last known iterative deployment.');
    }
    continueToPush = await context.amplify.confirmPrompt('Are you sure you want to continue?');
  }
  if (continueToPush) {
    try {
      const currentAmplifyMeta = amplify_cli_core_1.stateManager.getCurrentMeta();
      await providersPush(context, category, resourceName, filteredResources);
      await on_category_outputs_change_1.onCategoryOutputsChange(context, currentAmplifyMeta);
    } catch (err) {
      context.print.error(`\n${err.message}`);
      throw err;
    }
  }
  return continueToPush;
}
exports.pushResources = pushResources;
async function providersPush(context, category, resourceName, filteredResources) {
  const { providers } = get_project_config_1.getProjectConfig();
  const providerPlugins = get_provider_plugins_1.getProviderPlugins(context);
  const providerPromises = [];
  for (const provider of providers) {
    const providerModule = require(providerPlugins[provider]);
    const resourceDefiniton = await context.amplify.getResourceStatus(category, resourceName, provider, filteredResources);
    providerPromises.push(providerModule.pushResources(context, resourceDefiniton));
  }
  await Promise.all(providerPromises);
}
async function storeCurrentCloudBackend(context) {
  const { providers } = get_project_config_1.getProjectConfig();
  const providerPlugins = get_provider_plugins_1.getProviderPlugins(context);
  const providerPromises = [];
  for (const provider of providers) {
    const providerModule = require(providerPlugins[provider]);
    providerPromises.push(providerModule.storeCurrentCloudBackend(context));
  }
  await Promise.all(providerPromises);
}
exports.storeCurrentCloudBackend = storeCurrentCloudBackend;
//# sourceMappingURL=push-resources.js.map
