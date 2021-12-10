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
exports.generateAmplifyMetaFile = exports.generateLocalEnvInfoFile = exports.onSuccess = exports.onHeadlessSuccess = void 0;
const fs = __importStar(require('fs-extra'));
const promise_sequential_1 = __importDefault(require('promise-sequential'));
const amplify_cli_core_1 = require('amplify-cli-core');
const get_frontend_plugins_1 = require('../extensions/amplify-helpers/get-frontend-plugins');
const get_provider_plugins_1 = require('../extensions/amplify-helpers/get-provider-plugins');
const git_manager_1 = require('../extensions/amplify-helpers/git-manager');
const docs_manager_1 = require('../extensions/amplify-helpers/docs-manager');
const initialize_env_1 = require('../initialize-env');
async function onHeadlessSuccess(context) {
  const frontendPlugins = get_frontend_plugins_1.getFrontendPlugins(context);
  const frontendModule = require(frontendPlugins[context.exeInfo.projectConfig.frontend]);
  await frontendModule.onInitSuccessful(context);
}
exports.onHeadlessSuccess = onHeadlessSuccess;
async function onSuccess(context) {
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
  if (context.exeInfo.isNewProject) {
    const contextEnvironmentProvider = new amplify_cli_core_1.CLIContextEnvironmentProvider({
      getEnvInfo: context.amplify.getEnvInfo,
    });
    if (!amplify_cli_core_1.FeatureFlags.isInitialized()) {
      await amplify_cli_core_1.FeatureFlags.initialize(contextEnvironmentProvider, true);
    }
    await amplify_cli_core_1.FeatureFlags.ensureDefaultFeatureFlags(true);
  }
  context.exeInfo.projectConfig.providers.forEach(provider => {
    const providerModule = require(providerPlugins[provider]);
    providerOnSuccessTasks.push(() => providerModule.onInitSuccessful(context));
  });
  await promise_sequential_1.default(providerOnSuccessTasks);
  const currentAmplifyMeta = amplify_cli_core_1.stateManager.getCurrentMeta(undefined, {
    throwIfNotExist: false,
    default: {},
  });
  await initialize_env_1.initializeEnv(context, currentAmplifyMeta);
  if (!context.parameters.options.app) {
    printWelcomeMessage(context);
  }
}
exports.onSuccess = onSuccess;
function generateLocalRuntimeFiles(context) {
  generateLocalEnvInfoFile(context);
  generateAmplifyMetaFile(context);
  generateLocalTagsFile(context);
}
function generateLocalEnvInfoFile(context) {
  const { projectPath } = context.exeInfo.localEnvInfo;
  amplify_cli_core_1.stateManager.setLocalEnvInfo(projectPath, context.exeInfo.localEnvInfo);
}
exports.generateLocalEnvInfoFile = generateLocalEnvInfoFile;
function generateLocalTagsFile(context) {
  if (context.exeInfo.isNewProject) {
    const { projectPath } = context.exeInfo.localEnvInfo;
    const tags = amplify_cli_core_1.stateManager.getProjectTags(projectPath);
    if (!tags.find(t => t.Key === 'user:Stack')) {
      tags.push({
        Key: 'user:Stack',
        Value: '{project-env}',
      });
    }
    if (!tags.find(t => t.Key === 'user:Application')) {
      tags.push({
        Key: 'user:Application',
        Value: '{project-name}',
      });
    }
    amplify_cli_core_1.stateManager.setProjectFileTags(projectPath, tags);
  }
}
function generateAmplifyMetaFile(context) {
  if (context.exeInfo.isNewEnv) {
    const { projectPath } = context.exeInfo.localEnvInfo;
    amplify_cli_core_1.stateManager.setCurrentMeta(projectPath, context.exeInfo.amplifyMeta);
    amplify_cli_core_1.stateManager.setMeta(projectPath, context.exeInfo.amplifyMeta);
  }
}
exports.generateAmplifyMetaFile = generateAmplifyMetaFile;
function generateNonRuntimeFiles(context) {
  generateProjectConfigFile(context);
  generateBackendConfigFile(context);
  generateTeamProviderInfoFile(context);
  generateGitIgnoreFile(context);
  generateReadMeFile(context);
}
function generateProjectConfigFile(context) {
  if (context.exeInfo.isNewProject) {
    const { projectPath } = context.exeInfo.localEnvInfo;
    amplify_cli_core_1.stateManager.setProjectConfig(projectPath, context.exeInfo.projectConfig);
  }
}
function generateTeamProviderInfoFile(context) {
  const { projectPath } = context.exeInfo.localEnvInfo;
  let teamProviderInfo = {};
  if (amplify_cli_core_1.stateManager.teamProviderInfoExists(projectPath)) {
    teamProviderInfo = amplify_cli_core_1.stateManager.getTeamProviderInfo(projectPath, {
      throwIfNotExist: false,
      default: {},
    });
    Object.assign(teamProviderInfo, context.exeInfo.teamProviderInfo);
  } else {
    ({ teamProviderInfo } = context.exeInfo);
  }
  amplify_cli_core_1.stateManager.setTeamProviderInfo(projectPath, teamProviderInfo);
}
function generateBackendConfigFile(context) {
  if (context.exeInfo.isNewProject) {
    const { projectPath } = context.exeInfo.localEnvInfo;
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
function generateReadMeFile(context) {
  const { projectPath } = context.exeInfo.localEnvInfo;
  const readMeFilePath = amplify_cli_core_1.pathManager.getReadMeFilePath(projectPath);
  docs_manager_1.writeReadMeFile(readMeFilePath);
}
function printWelcomeMessage(context) {
  context.print.info('');
  context.print.success('Your project has been successfully initialized and connected to the cloud!');
  context.print.info('');
  context.print.success('Some next steps:');
  context.print.info('"amplify status" will show you what you\'ve added already and if it\'s locally configured or deployed');
  context.print.info('"amplify add <category>" will allow you to add features like user login or a backend API');
  context.print.info('"amplify push" will build all your local backend resources and provision it in the cloud');
  context.print.info('"amplify console" to open the Amplify Console and view your project status');
  context.print.info(
    '"amplify publish" will build all your local backend and frontend resources (if you have hosting category added) and provision it in the cloud',
  );
  context.print.info('');
  context.print.success('Pro tip:');
  context.print.info('Try "amplify add api" to create a backend API and then "amplify publish" to deploy everything');
  context.print.info('');
}
//# sourceMappingURL=s9-onSuccess.js.map
