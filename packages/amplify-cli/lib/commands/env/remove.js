'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.run = void 0;
const ora_1 = __importDefault(require('ora'));
const amplify_cli_core_1 = require('amplify-cli-core');
const delete_project_1 = require('../../extensions/amplify-helpers/delete-project');
const run = async context => {
  const envName = context.parameters.first;
  const currentEnv = context.amplify.getEnvInfo().envName;
  if (!envName) {
    const errMessage = "You must pass in the name of the environment as a part of the 'amplify env remove <env-name>' command";
    context.print.error(errMessage);
    await context.usageData.emitError(new amplify_cli_core_1.UnknownArgumentError(errMessage));
    amplify_cli_core_1.exitOnNextTick(1);
  }
  let envFound = false;
  const allEnvs = context.amplify.getEnvDetails();
  Object.keys(allEnvs).forEach(env => {
    if (env === envName) {
      envFound = true;
      delete allEnvs[env];
    }
  });
  if (!envFound) {
    context.print.error('No environment found with the corresponding name provided');
  } else {
    if (currentEnv === envName) {
      const errMessage =
        'You cannot delete your current environment. Please switch to another environment to delete your current environment';
      context.print.error(errMessage);
      context.print.error("If this is your only environment you can use the 'amplify delete' command to delete your project");
      await context.usageData.emitError(new amplify_cli_core_1.UnknownArgumentError(errMessage));
      amplify_cli_core_1.exitOnNextTick(1);
    }
    const confirmation = await delete_project_1.getConfirmation(context, envName);
    if (confirmation.proceed) {
      const spinner = ora_1.default('Deleting resources from the cloud. This may take a few minutes...');
      spinner.start();
      try {
        await context.amplify.removeEnvFromCloud(context, envName, confirmation.deleteS3);
      } catch (ex) {
        spinner.fail(`remove env failed: ${ex.message}`);
        throw ex;
      }
      spinner.succeed('Successfully removed environment from the cloud');
      amplify_cli_core_1.stateManager.setTeamProviderInfo(undefined, allEnvs);
      const awsInfo = amplify_cli_core_1.stateManager.getLocalAWSInfo();
      if (awsInfo[envName]) {
        delete awsInfo[envName];
        amplify_cli_core_1.stateManager.setLocalAWSInfo(undefined, awsInfo);
      }
      if (amplify_cli_core_1.FeatureFlags.isInitialized()) {
        await amplify_cli_core_1.FeatureFlags.removeFeatureFlagConfiguration(false, [envName]);
      }
      context.print.success('Successfully removed environment from your project locally');
    }
  }
};
exports.run = run;
//# sourceMappingURL=remove.js.map
