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
exports.onCategoryOutputsChange = void 0;
const fs = __importStar(require('fs-extra'));
const path = __importStar(require('path'));
const get_resource_outputs_1 = require('./get-resource-outputs');
const promise_sequential_1 = __importDefault(require('promise-sequential'));
const amplify_cli_core_1 = require('amplify-cli-core');
async function onCategoryOutputsChange(context, cloudAmplifyMeta, localMeta) {
  if (!cloudAmplifyMeta) {
    cloudAmplifyMeta = amplify_cli_core_1.stateManager.getCurrentMeta(undefined, {
      throwIfNotExist: false,
      default: {},
    });
  }
  const projectConfig = amplify_cli_core_1.stateManager.getProjectConfig();
  if (projectConfig.frontend) {
    const frontendPlugins = context.amplify.getFrontendPlugins(context);
    const frontendHandlerModule = require(frontendPlugins[projectConfig.frontend]);
    await frontendHandlerModule.createFrontendConfigs(
      context,
      get_resource_outputs_1.getResourceOutputs(localMeta),
      get_resource_outputs_1.getResourceOutputs(cloudAmplifyMeta),
    );
  }
  const outputChangedEventTasks = [];
  const categoryPluginInfoList = context.amplify.getAllCategoryPluginInfo(context);
  Object.keys(categoryPluginInfoList).forEach(category => {
    categoryPluginInfoList[category].forEach(pluginInfo => {
      const { packageLocation } = pluginInfo;
      const pluginModule = require(packageLocation);
      if (pluginModule && typeof pluginModule.onAmplifyCategoryOutputChange === 'function') {
        outputChangedEventTasks.push(async () => {
          try {
            attachContextExtensions(context, packageLocation);
            await pluginModule.onAmplifyCategoryOutputChange(context, cloudAmplifyMeta);
          } catch (e) {}
        });
      }
    });
  });
  if (outputChangedEventTasks.length > 0) {
    await promise_sequential_1.default(outputChangedEventTasks);
  }
}
exports.onCategoryOutputsChange = onCategoryOutputsChange;
function attachContextExtensions(context, packageLocation) {
  const extensionsDirPath = path.normalize(path.join(packageLocation, 'extensions'));
  if (fs.existsSync(extensionsDirPath)) {
    const stats = fs.statSync(extensionsDirPath);
    if (stats.isDirectory()) {
      const itemNames = fs.readdirSync(extensionsDirPath);
      itemNames.forEach(itemName => {
        const itemPath = path.join(extensionsDirPath, itemName);
        let itemModule;
        try {
          itemModule = require(itemPath);
          itemModule(context);
        } catch (e) {}
      });
    }
  }
}
//# sourceMappingURL=on-category-outputs-change.js.map
