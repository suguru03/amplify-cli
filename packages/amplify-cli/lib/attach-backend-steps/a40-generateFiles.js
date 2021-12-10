'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod) if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateFiles = void 0;
const fs = __importStar(require('fs-extra'));
const promise_sequential_1 = __importDefault(require('promise-sequential'));
const amplify_cli_core_1 = require('amplify-cli-core');
const get_frontend_plugins_1 = require('../extensions/amplify-helpers/get-frontend-plugins');
const get_provider_plugins_1 = require('../extensions/amplify-helpers/get-provider-plugins');
const git_manager_1 = require('../extensions/amplify-helpers/git-manager');
async function generateFiles(context) {
  const { projectPath } = context.exeInfo.localEnvInfo;
  const amplifyDirPath = amplify_cli_core_1.pathManager.getAmplifyDirPath(projectPath);
  const dotConfigDirPath = amplify_cli_core_1.pathManager.getDotConfigDirPath(projectPath);
  const backendDirPath = amplify_cli_core_1.pathManager.getBackendDirPath(projectPath);
  const currentBackendDirPath = amplify_cli_core_1.pathManager.getCurrentCloudBackendDirPath(projectPath);
  fs.ensureDirSync(amplifyDirPath);
  fs.ensureDirSync(dotConfigDirPath);
  fs.ensureDirSync(backendDirPath);
  fs.ensureDirSync(currentBackendDirPath);
  const providerPlugins = get_provider_plugins_1.getProviderPlugins(context);
  const providerOnSuccessTasks = [];
  const frontendPlugins = get_frontend_plugins_1.getFrontendPlugins(context);
  const frontendModule = require(frontendPlugins[context.exeInfo.projectConfig.frontend]);
  await frontendModule.onInitSuccessful(context);
  generateLocalRuntimeFiles(context);
  generateNonRuntimeFiles(context);
  context.exeInfo.projectConfig.providers.forEach(provider => {
    const providerModule = require(providerPlugins[provider]);
    providerOnSuccessTasks.push(() => providerModule.onInitSuccessful(context));
  });
  await promise_sequential_1.default(providerOnSuccessTasks);
  const currentAmplifyMeta = amplify_cli_core_1.stateManager.getCurrentMeta(undefined, {
    throwIfNotExist: false,
    default: {},
  });
  await context.amplify.onCategoryOutputsChange(context, currentAmplifyMeta);
  return context;
}
exports.generateFiles = generateFiles;
function generateLocalRuntimeFiles(context) {
  generateLocalEnvInfoFile(context);
}
function generateLocalEnvInfoFile(context) {
  const { projectPath } = context.exeInfo.localEnvInfo;
  amplify_cli_core_1.stateManager.setLocalEnvInfo(projectPath, context.exeInfo.localEnvInfo);
}
function generateNonRuntimeFiles(context) {
  generateProjectConfigFile(context);
  generateBackendConfigFile(context);
  generateTeamProviderInfoFile(context);
  generateGitIgnoreFile(context);
}
function generateProjectConfigFile(context) {
  if (context.exeInfo.isNewProject) {
    const { projectPath } = context.exeInfo.localEnvInfo;
    amplify_cli_core_1.stateManager.setProjectConfig(projectPath, context.exeInfo.projectConfig);
  }
}
function generateTeamProviderInfoFile(context) {
  const { projectPath, envName } = context.exeInfo.localEnvInfo;
  const { existingTeamProviderInfo, teamProviderInfo } = context.exeInfo;
  if (existingTeamProviderInfo) {
    if (existingTeamProviderInfo[envName]) {
      if (existingTeamProviderInfo[envName].categories) {
        teamProviderInfo[envName] = teamProviderInfo[envName] || {};
        teamProviderInfo[envName].categories = existingTeamProviderInfo[envName].categories;
      }
      delete existingTeamProviderInfo[envName];
    }
    Object.assign(teamProviderInfo, existingTeamProviderInfo);
  }
  amplify_cli_core_1.stateManager.setTeamProviderInfo(projectPath, teamProviderInfo);
}
function generateBackendConfigFile(context) {
  const { projectPath } = context.exeInfo.localEnvInfo;
  if (!amplify_cli_core_1.stateManager.backendConfigFileExists(projectPath)) {
    amplify_cli_core_1.stateManager.setBackendConfig(projectPath, {});
  }
}
function generateGitIgnoreFile(context) {
  if (context.exeInfo.isNewProject) {
    const { projectPath } = context.exeInfo.localEnvInfo;
    const gitIgnoreFilePath = amplify_cli_core_1.pathManager.getGitIgnoreFilePath(projectPath);
    git_manager_1.insertAmplifyIgnore(gitIgnoreFilePath);
  }
}
//# sourceMappingURL=a40-generateFiles.js.map
