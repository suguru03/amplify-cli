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
exports.isUnderScanCoverageSync = exports.normalizePluginDirectory = exports.getCorePluginVersion = exports.getCorePluginDirPath = exports.scanPluginPlatform = void 0;
const path = __importStar(require('path'));
const fs = __importStar(require('fs-extra'));
const plugin_collection_1 = require('../domain/plugin-collection');
const plugin_platform_1 = require('../domain/plugin-platform');
const constants_1 = require('../domain/constants');
const global_prefix_1 = require('../utils/global-prefix');
const plugin_info_1 = require('../domain/plugin-info');
const verify_plugin_1 = require('./verify-plugin');
const access_plugins_file_1 = require('./access-plugins-file');
const compare_plugins_1 = require('./compare-plugins');
const platform_health_check_1 = require('./platform-health-check');
const is_child_path_1 = __importDefault(require('../utils/is-child-path'));
const amplify_cli_core_1 = require('amplify-cli-core');
async function scanPluginPlatform(pluginPlatform) {
  pluginPlatform = pluginPlatform || access_plugins_file_1.readPluginsJsonFile() || new plugin_platform_1.PluginPlatform();
  pluginPlatform.plugins = new plugin_collection_1.PluginCollection();
  await addCore(pluginPlatform);
  const sequential = require('promise-sequential');
  if (pluginPlatform.userAddedLocations && pluginPlatform.userAddedLocations.length > 0) {
    pluginPlatform.userAddedLocations = pluginPlatform.userAddedLocations.filter(pluginDirPath => {
      const result = fs.existsSync(pluginDirPath);
      return result;
    });
    const scanUserLocationTasks = pluginPlatform.userAddedLocations.map(pluginDirPath => async () =>
      await verifyAndAdd(pluginPlatform, pluginDirPath),
    );
    await sequential(scanUserLocationTasks);
  }
  if (amplify_cli_core_1.isPackaged) {
    pluginPlatform.pluginDirectories.push(constants_1.constants.PackagedNodeModules);
  }
  if (pluginPlatform.pluginDirectories.length > 0 && pluginPlatform.pluginPrefixes.length > 0) {
    const scanDirTasks = pluginPlatform.pluginDirectories.map(directory => async () => {
      directory = normalizePluginDirectory(directory);
      const exists = await fs.pathExists(directory);
      if (exists) {
        const subDirNames = await fs.readdir(directory);
        if (subDirNames.length > 0) {
          const scanSubDirTasks = subDirNames.map(subDirName => {
            return async () => {
              if (isMatchingNamePattern(pluginPlatform.pluginPrefixes, subDirName)) {
                const pluginDirPath = path.join(directory, subDirName);
                await verifyAndAdd(pluginPlatform, pluginDirPath);
              }
            };
          });
          await sequential(scanSubDirTasks);
        }
      }
    });
    await sequential(scanDirTasks);
  }
  pluginPlatform.lastScanTime = new Date();
  access_plugins_file_1.writePluginsJsonFile(pluginPlatform);
  await platform_health_check_1.checkPlatformHealth(pluginPlatform);
  return pluginPlatform;
}
exports.scanPluginPlatform = scanPluginPlatform;
function getCorePluginDirPath() {
  return path.normalize(path.join(__dirname, '../../'));
}
exports.getCorePluginDirPath = getCorePluginDirPath;
function getCorePluginVersion() {
  const packageJsonFilePath = path.normalize(path.join(__dirname, '..', '..', 'package.json'));
  const packageJson = amplify_cli_core_1.JSONUtilities.readJson(packageJsonFilePath);
  return packageJson.version;
}
exports.getCorePluginVersion = getCorePluginVersion;
async function addCore(pluginPlatform) {
  const corePluginDirPath = getCorePluginDirPath();
  const pluginVerificationResult = await verify_plugin_1.verifyPlugin(corePluginDirPath);
  if (pluginVerificationResult.verified) {
    const manifest = pluginVerificationResult.manifest;
    const { name, version } = pluginVerificationResult.packageJson;
    const pluginInfo = new plugin_info_1.PluginInfo(name, version, corePluginDirPath, manifest);
    pluginPlatform.plugins[manifest.name] = [];
    pluginPlatform.plugins[manifest.name].push(pluginInfo);
  } else {
    throw new Error('The local Amplify-CLI is corrupted');
  }
}
function normalizePluginDirectory(directory) {
  switch (directory) {
    case constants_1.constants.PackagedNodeModules:
      return path.normalize(path.join(__dirname, '../../../..'));
    case constants_1.constants.LocalNodeModules:
      return path.normalize(path.join(__dirname, '../../node_modules'));
    case constants_1.constants.ParentDirectory:
      return path.normalize(path.join(__dirname, '../../../'));
    case constants_1.constants.GlobalNodeModules:
      return global_prefix_1.getGlobalNodeModuleDirPath();
    default:
      return directory;
  }
}
exports.normalizePluginDirectory = normalizePluginDirectory;
function isMatchingNamePattern(pluginPrefixes, pluginDirName) {
  if (pluginPrefixes && pluginPrefixes.length > 0) {
    return pluginPrefixes.some(prefix => {
      const regex = new RegExp(`^${prefix}`);
      return regex.test(pluginDirName);
    });
  }
  return true;
}
async function verifyAndAdd(pluginPlatform, pluginDirPath) {
  const pluginVerificationResult = await verify_plugin_1.verifyPlugin(pluginDirPath);
  if (pluginVerificationResult.verified && pluginVerificationResult.manifest.name !== constants_1.constants.CORE) {
    const manifest = pluginVerificationResult.manifest;
    const { name, version } = pluginVerificationResult.packageJson;
    const pluginInfo = new plugin_info_1.PluginInfo(name, version, pluginDirPath, manifest);
    let isPluginExcluded = false;
    if (pluginPlatform.excluded && pluginPlatform.excluded[manifest.name]) {
      isPluginExcluded = pluginPlatform.excluded[manifest.name].some(item => compare_plugins_1.twoPluginsAreTheSame(item, pluginInfo));
    }
    if (!isPluginExcluded) {
      pluginPlatform.plugins[manifest.name] = pluginPlatform.plugins[manifest.name] || [];
      const pluginAlreadyAdded = pluginPlatform.plugins[manifest.name].some(item =>
        compare_plugins_1.twoPluginsAreTheSame(item, pluginInfo),
      );
      if (!pluginAlreadyAdded) {
        pluginPlatform.plugins[manifest.name].push(pluginInfo);
      }
    }
  }
}
function isUnderScanCoverageSync(pluginPlatform, pluginDirPath) {
  let result = false;
  pluginDirPath = path.normalize(pluginDirPath);
  const pluginDirName = path.basename(pluginDirPath);
  if (fs.existsSync(pluginDirPath) && isMatchingNamePattern(pluginPlatform.pluginPrefixes, pluginDirName)) {
    result = pluginPlatform.pluginDirectories.some(directory => {
      directory = normalizePluginDirectory(directory);
      if (fs.existsSync(directory) && is_child_path_1.default(pluginDirPath, directory)) {
        return true;
      }
    });
  }
  return result;
}
exports.isUnderScanCoverageSync = isUnderScanCoverageSync;
//# sourceMappingURL=scan-plugin-platform.js.map
