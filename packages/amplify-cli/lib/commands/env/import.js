'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.run = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
const run = async context => {
  const envName = context.parameters.options.name;
  if (!envName) {
    const errMessage = 'You must pass in the name of the environment using the --name flag';
    context.print.error(errMessage);
    context.usageData.emitError(new amplify_cli_core_1.UnknownArgumentError(errMessage));
    amplify_cli_core_1.exitOnNextTick(1);
  }
  let config;
  try {
    config = amplify_cli_core_1.JSONUtilities.parse(context.parameters.options.config);
    let awsCF = config.awscloudformation;
    if (
      !(
        config.hasOwnProperty('awscloudformation') &&
        awsCF.hasOwnProperty('Region') &&
        awsCF.Region &&
        awsCF.hasOwnProperty('DeploymentBucketName') &&
        awsCF.DeploymentBucketName &&
        awsCF.hasOwnProperty('UnauthRoleName') &&
        awsCF.UnauthRoleName &&
        awsCF.hasOwnProperty('StackName') &&
        awsCF.StackName &&
        awsCF.hasOwnProperty('StackId') &&
        awsCF.StackId &&
        awsCF.hasOwnProperty('AuthRoleName') &&
        awsCF.AuthRoleName &&
        awsCF.hasOwnProperty('UnauthRoleArn') &&
        awsCF.UnauthRoleArn &&
        awsCF.hasOwnProperty('AuthRoleArn') &&
        awsCF.AuthRoleArn
      )
    ) {
      throw 'The provided config was invalid or incomplete';
    }
  } catch (e) {
    const errMessage = 'You must pass in the configs of the environment in an object format using the --config flag';
    context.print.error(errMessage);
    context.usageData.emitError(new amplify_cli_core_1.UnknownArgumentError(errMessage));
    amplify_cli_core_1.exitOnNextTick(1);
  }
  let awsInfo;
  if (context.parameters.options.awsInfo) {
    try {
      awsInfo = amplify_cli_core_1.JSONUtilities.parse(context.parameters.options.awsInfo);
    } catch (e) {
      const errMessage =
        'You must pass in the AWS credential info in an object format for intializating your environment using the --awsInfo flag';
      context.print.error(errMessage);
      context.usageData.emitError(new amplify_cli_core_1.UnknownArgumentError(errMessage));
      amplify_cli_core_1.exitOnNextTick(1);
    }
  }
  const allEnvs = context.amplify.getEnvDetails();
  const addNewEnvConfig = () => {
    allEnvs[envName] = config;
    amplify_cli_core_1.stateManager.setTeamProviderInfo(undefined, allEnvs);
    const envAwsInfo = amplify_cli_core_1.stateManager.getLocalAWSInfo(undefined, {
      throwIfNotExist: false,
      default: {},
    });
    envAwsInfo[envName] = awsInfo;
    amplify_cli_core_1.stateManager.setLocalAWSInfo(undefined, envAwsInfo);
    context.print.success('Successfully added environment from your project');
  };
  if (allEnvs.hasOwnProperty(envName)) {
    if (context.parameters.options.yes) {
      addNewEnvConfig();
    } else if (
      await context.amplify.confirmPrompt(
        'We found an environment with the same name. Do you want to overwrite the existing environment config?',
      )
    ) {
      addNewEnvConfig();
    }
  } else {
    addNewEnvConfig();
  }
};
exports.run = run;
//# sourceMappingURL=import.js.map
