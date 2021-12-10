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
Object.defineProperty(exports, '__esModule', { value: true });
exports.analyzeProject = exports.displayConfigurationDefaults = exports.analyzeProjectHeadless = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
const fs = __importStar(require('fs-extra'));
const inquirer = __importStar(require('inquirer'));
const path = __importStar(require('path'));
const constants_1 = require('../extensions/amplify-helpers/constants');
const editor_selection_1 = require('../extensions/amplify-helpers/editor-selection');
const get_frontend_plugins_1 = require('../extensions/amplify-helpers/get-frontend-plugins');
const project_name_validation_1 = require('../extensions/amplify-helpers/project-name-validation');
const s1_initFrontend_1 = require('./s1-initFrontend');
async function analyzeProjectHeadless(context) {
  var _a;
  const projectPath = process.cwd();
  const projectName = path.basename(projectPath);
  const env = getDefaultEnv(context);
  setProjectConfig(context, projectName);
  setExeInfo(context, projectPath, undefined, env);
  const { frontend } =
    (_a = context === null || context === void 0 ? void 0 : context.parameters) === null || _a === void 0 ? void 0 : _a.options;
  if (!frontend) {
    context.print.warning('No frontend specified. Defaulting to android.');
    context.exeInfo.projectConfig.frontend = 'android';
  } else {
    context.exeInfo.projectConfig.frontend = frontend;
  }
}
exports.analyzeProjectHeadless = analyzeProjectHeadless;
function displayConfigurationDefaults(context, defaultProjectName, defaultEnv, defaultEditorName) {
  context.print.info('Project information');
  context.print.info(`| Name: ${defaultProjectName}`);
  context.print.info(`| Environment: ${defaultEnv}`);
  context.print.info(`| Default editor: ${defaultEditorName}`);
}
exports.displayConfigurationDefaults = displayConfigurationDefaults;
function setConfigurationDefaults(context, projectPath, defaultProjectName, defaultEnv, defaultEditor) {
  setExeInfo(context, projectPath, defaultEditor, defaultEnv);
  setProjectConfig(context, defaultProjectName);
  context.exeInfo.inputParams.amplify = context.exeInfo.inputParams.amplify || {};
  context.exeInfo.inputParams.amplify.projectName = defaultProjectName;
  context.exeInfo.inputParams.amplify.envName = defaultEnv;
  context.exeInfo.inputParams.amplify.defaultEditor = defaultEditor;
}
async function displayAndSetDefaults(context, projectPath, projectName) {
  var _a, _b, _c;
  const defaultProjectName = projectName;
  const defaultEnv = getDefaultEnv(context);
  let defaultEditor;
  if (
    (_c =
      (_b =
        (_a = context === null || context === void 0 ? void 0 : context.exeInfo) === null || _a === void 0 ? void 0 : _a.inputParams) ===
        null || _b === void 0
        ? void 0
        : _b.amplify) === null || _c === void 0
      ? void 0
      : _c.defaultEditor
  ) {
    defaultEditor = editor_selection_1.normalizeEditor(context.exeInfo.inputParams.amplify.defaultEditor);
  } else {
    defaultEditor = editor_selection_1.editors.length > 0 ? editor_selection_1.editors[0].value : 'vscode';
  }
  const editorIndex = editor_selection_1.editors.findIndex(editorEntry => editorEntry.value === defaultEditor);
  const defaultEditorName = editorIndex > -1 ? editor_selection_1.editors[editorIndex].name : 'Visual Studio Code';
  context.print.success('The following configuration will be applied:');
  context.print.info('');
  await displayConfigurationDefaults(context, defaultProjectName, defaultEnv, defaultEditorName);
  const frontendPlugins = get_frontend_plugins_1.getFrontendPlugins(context);
  const defaultFrontend = s1_initFrontend_1.getSuitableFrontend(context, frontendPlugins, projectPath);
  const frontendModule = require(frontendPlugins[defaultFrontend]);
  await frontendModule.displayFrontendDefaults(context, projectPath);
  context.print.info('');
  if (context.exeInfo.inputParams.yes || (await context.amplify.confirmPrompt('Initialize the project with the above configuration?'))) {
    await setConfigurationDefaults(context, projectPath, defaultProjectName, defaultEnv, defaultEditorName);
    await frontendModule.setFrontendDefaults(context, projectPath);
  }
}
async function analyzeProject(context) {
  var _a, _b;
  if (!context.parameters.options.app || !context.parameters.options.quickstart) {
    context.print.warning('Note: It is recommended to run this command from the root of your app directory');
  }
  const projectPath = process.cwd();
  context.exeInfo.isNewProject = isNewProject(context);
  const projectName = await getProjectName(context);
  if (context.exeInfo.isNewProject && context.parameters.command !== 'env') {
    await displayAndSetDefaults(context, projectPath, projectName);
  }
  const envName = await getEnvName(context);
  let defaultEditor = getDefaultEditor();
  if (!defaultEditor) {
    defaultEditor = await getEditor(context);
  }
  context.exeInfo.isNewEnv = isNewEnv(envName);
  context.exeInfo.forcePush = !!((_b =
    (_a = context === null || context === void 0 ? void 0 : context.parameters) === null || _a === void 0 ? void 0 : _a.options) === null ||
  _b === void 0
    ? void 0
    : _b.forcePush);
  if (context.exeInfo.isNewEnv && !context.exeInfo.isNewProject) {
    const currentLocalEnvInfo = amplify_cli_core_1.stateManager.getLocalEnvInfo(undefined, {
      throwIfNotExist: false,
    });
    if (currentLocalEnvInfo) {
      context.exeInfo.sourceEnvName = currentLocalEnvInfo.envName;
    }
  }
  setProjectConfig(context, projectName);
  setExeInfo(context, projectPath, defaultEditor, envName);
  return context;
}
exports.analyzeProject = analyzeProject;
function setProjectConfig(context, projectName) {
  context.exeInfo.isNewProject = isNewProject(context);
  context.exeInfo.projectConfig = {
    projectName,
    version: constants_1.amplifyCLIConstants.CURRENT_PROJECT_CONFIG_VERSION,
  };
}
function setExeInfo(context, projectPath, defaultEditor, envName) {
  context.exeInfo.localEnvInfo = {
    projectPath,
    defaultEditor,
    envName,
  };
  context.exeInfo.teamProviderInfo = {};
  context.exeInfo.metaData = {};
  return context;
}
async function getProjectName(context) {
  let projectName;
  const projectPath = process.cwd();
  if (!context.exeInfo.isNewProject) {
    const projectConfig = amplify_cli_core_1.stateManager.getProjectConfig(projectPath);
    projectName = projectConfig.projectName;
    return projectName;
  }
  if (context.exeInfo.inputParams.amplify && context.exeInfo.inputParams.amplify.projectName) {
    projectName = project_name_validation_1.normalizeProjectName(context.exeInfo.inputParams.amplify.projectName);
  } else {
    projectName = project_name_validation_1.normalizeProjectName(path.basename(projectPath));
    if (!context.exeInfo.inputParams.yes) {
      const projectNameQuestion = {
        type: 'input',
        name: 'inputProjectName',
        message: 'Enter a name for the project',
        default: projectName,
        validate: input =>
          project_name_validation_1.isProjectNameValid(input) || 'Project name should be between 3 and 20 characters and alphanumeric',
      };
      const answer = await inquirer.prompt(projectNameQuestion);
      projectName = answer.inputProjectName;
    }
  }
  return projectName;
}
async function getEditor(context) {
  let editor;
  if (context.exeInfo.inputParams.amplify && context.exeInfo.inputParams.amplify.defaultEditor) {
    editor = editor_selection_1.normalizeEditor(context.exeInfo.inputParams.amplify.defaultEditor);
  } else if (!context.exeInfo.inputParams.yes) {
    editor = await editor_selection_1.editorSelection(editor);
  }
  return editor;
}
const isEnvNameValid = inputEnvName => {
  return /^[a-z]{2,10}$/.test(inputEnvName);
};
const INVALID_ENV_NAME_MSG = 'Environment name must be between 2 and 10 characters, and lowercase only.';
function getDefaultEnv(context) {
  var _a, _b, _c;
  let defaultEnv = 'dev';
  if (
    (_c =
      (_b =
        (_a = context === null || context === void 0 ? void 0 : context.exeInfo) === null || _a === void 0 ? void 0 : _a.inputParams) ===
        null || _b === void 0
        ? void 0
        : _b.amplify) === null || _c === void 0
      ? void 0
      : _c.envName
  ) {
    if (isEnvNameValid(context.exeInfo.inputParams.amplify.envName)) {
      defaultEnv = context.exeInfo.inputParams.amplify.envName;
      return defaultEnv;
    }
    context.print.error(INVALID_ENV_NAME_MSG);
    context.usageData.emitError(new amplify_cli_core_1.InvalidEnvironmentNameError(INVALID_ENV_NAME_MSG));
    amplify_cli_core_1.exitOnNextTick(1);
  }
  if (isNewProject(context) || !context.amplify.getAllEnvs().includes(defaultEnv)) {
    return defaultEnv;
  }
  return undefined;
}
async function getEnvName(context) {
  let envName;
  if (context.exeInfo.inputParams.amplify && context.exeInfo.inputParams.amplify.envName) {
    if (isEnvNameValid(context.exeInfo.inputParams.amplify.envName)) {
      ({ envName } = context.exeInfo.inputParams.amplify);
      return envName;
    }
    context.print.error(INVALID_ENV_NAME_MSG);
    await context.usageData.emitError(new amplify_cli_core_1.InvalidEnvironmentNameError(INVALID_ENV_NAME_MSG));
    amplify_cli_core_1.exitOnNextTick(1);
  } else if (context.exeInfo.inputParams && context.exeInfo.inputParams.yes) {
    context.print.error('Environment name missing');
    await context.usageData.emitError(new amplify_cli_core_1.InvalidEnvironmentNameError(INVALID_ENV_NAME_MSG));
    amplify_cli_core_1.exitOnNextTick(1);
  }
  const newEnvQuestion = async () => {
    let defaultEnvName = getDefaultEnv(context);
    const envNameQuestion = {
      type: 'input',
      name: 'envName',
      message: 'Enter a name for the environment',
      default: defaultEnvName,
      validate: input => (!isEnvNameValid(input) ? INVALID_ENV_NAME_MSG : true),
    };
    ({ envName } = await inquirer.prompt(envNameQuestion));
  };
  if (isNewProject(context)) {
    await newEnvQuestion();
  } else {
    const allEnvs = context.amplify.getAllEnvs();
    if (allEnvs.length > 0) {
      if (await context.amplify.confirmPrompt('Do you want to use an existing environment?')) {
        const envQuestion = {
          type: 'list',
          name: 'envName',
          message: 'Choose the environment you would like to use:',
          choices: allEnvs,
        };
        ({ envName } = await inquirer.prompt(envQuestion));
      } else {
        await newEnvQuestion();
      }
    } else {
      await newEnvQuestion();
    }
  }
  return envName;
}
function isNewEnv(envName) {
  let newEnv = true;
  const projectPath = process.cwd();
  const teamProviderInfo = amplify_cli_core_1.stateManager.getTeamProviderInfo(projectPath, {
    throwIfNotExist: false,
    default: {},
  });
  if (teamProviderInfo[envName]) {
    newEnv = false;
  }
  return newEnv;
}
function isNewProject(context) {
  let newProject = true;
  const projectPath = process.cwd();
  const projectConfigFilePath = context.amplify.pathManager.getProjectConfigFilePath(projectPath);
  if (fs.existsSync(projectConfigFilePath)) {
    newProject = false;
  }
  return newProject;
}
function getDefaultEditor() {
  const projectPath = process.cwd();
  const localEnvInfo = amplify_cli_core_1.stateManager.getLocalEnvInfo(projectPath, {
    throwIfNotExist: false,
    default: {},
  });
  return localEnvInfo.defaultEditor;
}
//# sourceMappingURL=s0-analyzeProject.js.map
