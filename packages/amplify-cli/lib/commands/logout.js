'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.run = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
const enquirer_1 = require('enquirer');
const aws_sdk_1 = require('aws-sdk');
const run = async context => {
  const { appId } = context.parameters.options;
  if (!appId || appId === true) {
    context.print.info(`Expected parameters: --appId <appId>`);
    return;
  }
  const amplifyAdminConfig = amplify_cli_core_1.stateManager.getAmplifyAdminConfigEntry(appId);
  if (!amplifyAdminConfig) {
    context.print.info(`No access information found for appId ${appId}`);
    return;
  }
  const response = await enquirer_1.prompt({
    type: 'confirm',
    name: 'useGlobalSignOut',
    message: 'Do you want to logout from all sessions?',
  });
  if (response.useGlobalSignOut) {
    const cognitoISP = new aws_sdk_1.CognitoIdentityServiceProvider({ region: amplifyAdminConfig.region });
    try {
      await cognitoISP.globalSignOut(amplifyAdminConfig.accessToken.jwtToken);
      context.print.info('Logged out globally.');
    } catch (e) {
      context.print.error(`An error occurred during logout: ${e.message}`);
      return;
    }
  }
  amplify_cli_core_1.stateManager.removeAmplifyAdminConfigEntry(appId);
};
exports.run = run;
//# sourceMappingURL=logout.js.map
