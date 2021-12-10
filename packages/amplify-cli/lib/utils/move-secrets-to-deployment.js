'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.moveSecretsFromTeamProviderToDeployment = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
const get_root_stack_id_1 = require('../extensions/amplify-helpers/get-root-stack-id');
const hostedUIProviderCredsField = 'hostedUIProviderCreds';
const moveSecretsFromTeamProviderToDeployment = projectPath => {
  const { envName } = amplify_cli_core_1.stateManager.getLocalEnvInfo(projectPath);
  let teamProviderInfo = amplify_cli_core_1.stateManager.getTeamProviderInfo();
  const envTeamProvider = teamProviderInfo[envName];
  let secrets = amplify_cli_core_1.stateManager.getDeploymentSecrets();
  Object.keys(envTeamProvider.categories)
    .filter(category => category === 'auth')
    .forEach(() => {
      Object.keys(envTeamProvider.categories.auth).forEach(resourceName => {
        if (envTeamProvider.categories.auth[resourceName][hostedUIProviderCredsField]) {
          const teamProviderSecrets = envTeamProvider.categories.auth[resourceName][hostedUIProviderCredsField];
          delete envTeamProvider.categories.auth[resourceName][hostedUIProviderCredsField];
          const rootStackId = get_root_stack_id_1.getRootStackId();
          secrets = amplify_cli_core_1.mergeDeploymentSecrets({
            currentDeploymentSecrets: secrets,
            category: 'auth',
            rootStackId,
            envName,
            resource: resourceName,
            keyName: hostedUIProviderCredsField,
            value: teamProviderSecrets,
          });
        }
      });
    });
  amplify_cli_core_1.stateManager.setTeamProviderInfo(undefined, teamProviderInfo);
  amplify_cli_core_1.stateManager.setDeploymentSecrets(secrets);
};
exports.moveSecretsFromTeamProviderToDeployment = moveSecretsFromTeamProviderToDeployment;
//# sourceMappingURL=move-secrets-to-deployment.js.map
