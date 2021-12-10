'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getConfirmation = exports.deleteProject = void 0;
const ora_1 = __importDefault(require('ora'));
const chalk_1 = __importDefault(require('chalk'));
const amplify_cli_core_1 = require('amplify-cli-core');
const remove_env_from_cloud_1 = require('./remove-env-from-cloud');
const get_frontend_plugins_1 = require('./get-frontend-plugins');
const get_plugin_instance_1 = require('./get-plugin-instance');
const get_amplify_appId_1 = require('./get-amplify-appId');
const path_manager_1 = require('./path-manager');
async function deleteProject(context) {
  const confirmation = await getConfirmation(context);
  if (confirmation.proceed) {
    const allEnvs = context.amplify.getEnvDetails();
    const envNames = Object.keys(allEnvs);
    if (amplify_cli_core_1.FeatureFlags.isInitialized()) {
      await amplify_cli_core_1.FeatureFlags.removeFeatureFlagConfiguration(true, envNames);
    }
    const spinner = ora_1.default('Deleting resources from the cloud. This may take a few minutes...');
    try {
      spinner.start();
      await Promise.all(Object.keys(allEnvs).map(env => remove_env_from_cloud_1.removeEnvFromCloud(context, env, confirmation.deleteS3)));
      const appId = get_amplify_appId_1.getAmplifyAppId();
      if (confirmation.deleteAmplifyApp && appId) {
        const awsCloudPlugin = get_plugin_instance_1.getPluginInstance(context, 'awscloudformation');
        const amplifyClient = await awsCloudPlugin.getConfiguredAmplifyClient(context, {});
        const environments = await amplifyBackendEnvironments(amplifyClient, appId);
        if (environments.length === 0) {
          await amplifyClient.deleteApp({ appId }).promise();
        } else {
          context.print.warning('Amplify App cannot be deleted, other environments still linked to Application');
        }
      }
    } catch (ex) {
      spinner.fail('Project delete failed');
      throw ex;
    }
    spinner.succeed('Project deleted in the cloud');
    const { frontend } = context.amplify.getProjectConfig();
    const frontendPlugins = get_frontend_plugins_1.getFrontendPlugins(context);
    const frontendPluginModule = require(frontendPlugins[frontend]);
    frontendPluginModule.deleteConfig(context);
    context.filesystem.remove(path_manager_1.getAmplifyDirPath());
    context.print.success('Project deleted locally.');
  }
}
exports.deleteProject = deleteProject;
async function amplifyBackendEnvironments(client, appId) {
  const data = await client
    .listBackendEnvironments({
      appId,
    })
    .promise();
  return data.backendEnvironments;
}
async function getConfirmation(context, env) {
  if (context.input.options && context.input.options.force)
    return {
      proceed: true,
      deleteS3: true,
      deleteAmplifyApp: !process.env.CLI_DEV_INTERNAL_DISABLE_AMPLIFY_APP_DELETION,
    };
  const environmentText = env ? `'${env}' environment` : 'all the environments';
  return {
    proceed: await context.amplify.confirmPrompt(
      chalk_1.default.red(
        `Are you sure you want to continue? This CANNOT be undone. (This will delete ${environmentText} of the project from the cloud${
          env ? '' : ' and wipe out all the local files created by Amplify CLI'
        })`,
      ),
      false,
    ),
    deleteS3: true,
    deleteAmplifyApp: true,
  };
}
exports.getConfirmation = getConfirmation;
//# sourceMappingURL=delete-project.js.map
