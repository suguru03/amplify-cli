'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.configFrontendHandler = void 0;
const inquirer_1 = __importDefault(require('inquirer'));
const get_frontend_plugins_1 = require('../extensions/amplify-helpers/get-frontend-plugins');
const input_params_manager_1 = require('../input-params-manager');
async function configFrontendHandler(context) {
  const frontendPlugins = get_frontend_plugins_1.getFrontendPlugins(context);
  const { frontend } = context.exeInfo.projectConfig;
  const selectedFrontend = await selectFrontendHandler(context, frontendPlugins, frontend);
  if (selectedFrontend !== frontend) {
    delete context.exeInfo.projectConfig[frontend];
    const frontendModule = require(frontendPlugins[selectedFrontend]);
    await frontendModule.init(context);
    context.exeInfo.projectConfig.frontend = selectedFrontend;
  } else {
    const frontendModule = require(frontendPlugins[selectedFrontend]);
    await frontendModule.configure(context);
  }
  return context;
}
exports.configFrontendHandler = configFrontendHandler;
async function selectFrontendHandler(context, frontendPlugins, currentFrontend) {
  let frontend;
  const frontendPluginList = Object.keys(frontendPlugins);
  const { inputParams } = context.exeInfo;
  if (inputParams.amplify.frontend) {
    frontend = input_params_manager_1.normalizeFrontendHandlerName(inputParams.amplify.frontend, frontendPluginList);
  }
  if (!frontend && inputParams.yes) {
    frontend = 'javascript';
  }
  if (!frontend) {
    const selectFrontend = {
      type: 'list',
      name: 'selectedFrontend',
      message: "Choose the type of app that you're building",
      choices: Object.keys(frontendPlugins),
      default: currentFrontend,
    };
    const answer = await inquirer_1.default.prompt(selectFrontend);
    frontend = answer.selectedFrontend;
  }
  return frontend;
}
//# sourceMappingURL=c1-configFrontend.js.map
