'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.persistContext = exports.attachUsageData = exports.constructContext = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
const app_config_1 = require('./app-config');
const context_extensions_1 = require('./context-extensions');
const amplify_usageData_1 = require('./domain/amplify-usageData');
const context_1 = require('./domain/context');
function constructContext(pluginPlatform, input) {
  const context = new context_1.Context(pluginPlatform, input);
  context_extensions_1.attachExtentions(context);
  return context;
}
exports.constructContext = constructContext;
async function attachUsageData(context) {
  const { AMPLIFY_CLI_ENABLE_USAGE_DATA } = process.env;
  const config = app_config_1.init(context);
  const usageTrackingEnabled = AMPLIFY_CLI_ENABLE_USAGE_DATA
    ? AMPLIFY_CLI_ENABLE_USAGE_DATA === 'true'
    : config.usageDataConfig.isUsageTrackingEnabled;
  if (usageTrackingEnabled) {
    context.usageData = amplify_usageData_1.UsageData.Instance;
  } else {
    context.usageData = amplify_usageData_1.NoUsageData.Instance;
  }
  context.usageData.init(config.usageDataConfig.installationUuid, getVersion(context), context.input, '', getProjectSettings());
}
exports.attachUsageData = attachUsageData;
const getVersion = context => context.pluginPlatform.plugins.core[0].packageVersion;
const getProjectSettings = () => {
  var _a;
  const projectSettings = {};
  if (amplify_cli_core_1.stateManager.projectConfigExists()) {
    const projectConfig = amplify_cli_core_1.stateManager.getProjectConfig();
    const frontend = projectConfig.frontend;
    projectSettings.frontend = frontend;
    projectSettings.framework =
      (_a = projectConfig === null || projectConfig === void 0 ? void 0 : projectConfig.frontend) === null || _a === void 0
        ? void 0
        : _a.framework;
  }
  if (amplify_cli_core_1.stateManager.localEnvInfoExists()) {
    const { defaultEditor } = amplify_cli_core_1.stateManager.getLocalEnvInfo();
    projectSettings.editor = defaultEditor;
  }
  return projectSettings;
};
function persistContext(context) {}
exports.persistContext = persistContext;
//# sourceMappingURL=context-manager.js.map
