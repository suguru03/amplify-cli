'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.removeDeploymentSecrets = exports.removeResourceParameters = exports.loadEnvResourceParameters = exports.saveEnvResourceParameters = void 0;
const lodash_1 = __importDefault(require('lodash'));
const get_env_info_1 = require('./get-env-info');
const amplify_cli_core_1 = require('amplify-cli-core');
const get_root_stack_id_1 = require('./get-root-stack-id');
const CATEGORIES = 'categories';
const hostedUIProviderCredsField = 'hostedUIProviderCreds';
function isMigrationContext(context) {
  return 'migrationInfo' in context;
}
function getCurrentEnvName(context) {
  if (isMigrationContext(context)) {
    return context.migrationInfo.localEnvInfo.envName;
  }
  return get_env_info_1.getEnvInfo().envName;
}
function getApplicableTeamProviderInfo(context) {
  try {
    if (isMigrationContext(context)) {
      return context.migrationInfo.teamProviderInfo;
    }
    return amplify_cli_core_1.stateManager.getTeamProviderInfo(undefined, {
      throwIfNotExist: false,
      default: {},
    });
  } catch (e) {
    return {};
  }
}
function getOrCreateSubObject(data, keys) {
  let currentObj = data;
  keys.forEach(key => {
    if (!(key in currentObj)) {
      currentObj[key] = {};
    }
    currentObj = currentObj[key];
  });
  return currentObj;
}
function removeObjectRecursively(obj, keys) {
  if (keys.length > 1) {
    const [currentKey, ...rest] = keys;
    if (currentKey in obj) {
      removeObjectRecursively(obj[currentKey], rest);
      if (!Object.keys(obj[currentKey]).length) {
        delete obj[currentKey];
      }
    }
  } else {
    const [currentKey] = keys;
    if (currentKey in obj) {
      delete obj[currentKey];
    }
  }
}
function saveEnvResourceParameters(context, category, resource, parameters) {
  if (!parameters) {
    return;
  }
  const teamProviderInfo = getApplicableTeamProviderInfo(context);
  const currentEnv = getCurrentEnvName(context);
  const resources = getOrCreateSubObject(teamProviderInfo, [currentEnv, CATEGORIES, category]);
  const { hostedUIProviderCreds, ...otherParameters } = parameters;
  resources[resource] = lodash_1.default.assign(resources[resource], otherParameters);
  if (!isMigrationContext(context)) {
    amplify_cli_core_1.stateManager.setTeamProviderInfo(undefined, teamProviderInfo);
    const deploymentSecrets = amplify_cli_core_1.stateManager.getDeploymentSecrets();
    const rootStackId = get_root_stack_id_1.getRootStackId();
    if (hostedUIProviderCreds) {
      amplify_cli_core_1.stateManager.setDeploymentSecrets(
        amplify_cli_core_1.mergeDeploymentSecrets({
          currentDeploymentSecrets: deploymentSecrets,
          rootStackId,
          category,
          envName: currentEnv,
          keyName: hostedUIProviderCredsField,
          value: hostedUIProviderCreds,
          resource,
        }),
      );
    } else {
      amplify_cli_core_1.stateManager.setDeploymentSecrets(
        amplify_cli_core_1.removeFromDeploymentSecrets({
          currentDeploymentSecrets: deploymentSecrets,
          rootStackId,
          category,
          resource,
          envName: currentEnv,
          keyName: hostedUIProviderCredsField,
        }),
      );
    }
  }
}
exports.saveEnvResourceParameters = saveEnvResourceParameters;
function loadEnvResourceParameters(context, category, resource) {
  const envParameters = {
    ...loadEnvResourceParametersFromDeploymentSecrets(context, category, resource),
    ...loadEnvResourceParametersFromTeamproviderInfo(context, category, resource),
  };
  return envParameters;
}
exports.loadEnvResourceParameters = loadEnvResourceParameters;
function loadEnvResourceParametersFromDeploymentSecrets(context, category, resource) {
  try {
    const currentEnv = getCurrentEnvName(context);
    const deploymentSecrets = amplify_cli_core_1.stateManager.getDeploymentSecrets();
    const rootStackId = get_root_stack_id_1.getRootStackId();
    const deploymentSecretByAppId = lodash_1.default.find(deploymentSecrets.appSecrets, appSecret => appSecret.rootStackId === rootStackId);
    if (deploymentSecretByAppId) {
      return lodash_1.default.get(deploymentSecretByAppId.environments, [currentEnv, category, resource]);
    } else {
      const parameters = amplify_cli_core_1.stateManager.getResourceParametersJson(undefined, category, resource);
      if (parameters && parameters.hostedUI) {
        return lodash_1.default.set({}, hostedUIProviderCredsField, '[]');
      }
    }
  } catch (e) {}
  return {};
}
function loadEnvResourceParametersFromTeamproviderInfo(context, category, resource) {
  try {
    const teamProviderInfo = getApplicableTeamProviderInfo(context);
    const currentEnv = getCurrentEnvName(context);
    return getOrCreateSubObject(teamProviderInfo, [currentEnv, CATEGORIES, category, resource]);
  } catch (e) {
    return {};
  }
}
function removeResourceParameters(context, category, resource) {
  const teamProviderInfo = getApplicableTeamProviderInfo(context);
  const currentEnv = getCurrentEnvName(context);
  removeObjectRecursively(teamProviderInfo, [currentEnv, CATEGORIES, category, resource]);
  if (!isMigrationContext(context)) {
    amplify_cli_core_1.stateManager.setTeamProviderInfo(undefined, teamProviderInfo);
    removeDeploymentSecrets(context, category, resource);
  }
}
exports.removeResourceParameters = removeResourceParameters;
function removeDeploymentSecrets(context, category, resource) {
  const currentEnv = getCurrentEnvName(context);
  const deploymentSecrets = amplify_cli_core_1.stateManager.getDeploymentSecrets();
  const rootStackId = get_root_stack_id_1.getRootStackId();
  if (!isMigrationContext(context)) {
    amplify_cli_core_1.stateManager.setDeploymentSecrets(
      amplify_cli_core_1.removeFromDeploymentSecrets({
        currentDeploymentSecrets: deploymentSecrets,
        rootStackId,
        envName: currentEnv,
        category: category,
        resource: resource,
        keyName: hostedUIProviderCredsField,
      }),
    );
  }
}
exports.removeDeploymentSecrets = removeDeploymentSecrets;
//# sourceMappingURL=envResourceParams.js.map
