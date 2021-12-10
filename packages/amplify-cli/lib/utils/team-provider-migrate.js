'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.migrateTeamProviderInfo = void 0;
const amplify_category_auth_1 = require('amplify-category-auth');
const amplify_cli_core_1 = require('amplify-cli-core');
const chalk_1 = __importDefault(require('chalk'));
const lodash_1 = __importDefault(require('lodash'));
const headless_input_utils_1 = require('./headless-input-utils');
const move_secrets_to_deployment_1 = require('./move-secrets-to-deployment');
const message = `Amplify has been upgraded to handle secrets more securely by migrating some values in ${chalk_1.default.red(
  amplify_cli_core_1.PathConstants.TeamProviderInfoFileName,
)} to ${chalk_1.default.green(amplify_cli_core_1.PathConstants.DeploymentSecretsFileName)}
You can create a back up of the ${chalk_1.default.red(amplify_cli_core_1.PathConstants.TeamProviderInfoFileName)} file before proceeding.`;
const hostedUIProviderCredsField = 'hostedUIProviderCreds';
const migrateTeamProviderInfo = async context => {
  if (!isInvalidEnvOrPulling(context) && amplify_cli_core_1.pathManager.findProjectRoot()) {
    const authResourceName = teamProviderInfoGetAuthResourceNameHasSecrets();
    if (!authResourceName) {
      return true;
    }
    if (headless_input_utils_1.isYesFlagSet(context) || (await context.prompt.confirm(message))) {
      const authParams = amplify_cli_core_1.stateManager.getResourceParametersJson(undefined, 'auth', authResourceName);
      move_secrets_to_deployment_1.moveSecretsFromTeamProviderToDeployment();
      await amplify_category_auth_1.externalAuthEnable(context, undefined, undefined, authParams);
    } else {
      return false;
    }
  }
  return true;
};
exports.migrateTeamProviderInfo = migrateTeamProviderInfo;
function isInvalidEnvOrPulling(context) {
  if (!amplify_cli_core_1.stateManager.localEnvInfoExists()) {
    return true;
  }
  if (context.input.command) {
    return ['pull', 'init', 'env', 'delete'].includes(context.input.command);
  }
  return false;
}
function teamProviderInfoGetAuthResourceNameHasSecrets() {
  if (amplify_cli_core_1.stateManager.teamProviderInfoExists()) {
    const teamProviderInfo = amplify_cli_core_1.stateManager.getTeamProviderInfo();
    const { envName } = amplify_cli_core_1.stateManager.getLocalEnvInfo();
    const authResources = lodash_1.default.get(teamProviderInfo, [envName, 'categories', 'auth']);
    if (authResources) {
      return lodash_1.default.find(Object.keys(authResources), resource =>
        lodash_1.default.has(authResources, [resource, hostedUIProviderCredsField]),
      );
    }
  }
}
//# sourceMappingURL=team-provider-migrate.js.map
