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
exports.getCurrentAmplifyMetaFilePath = exports.getAmplifyMetaFilePath = exports.getCurrentBackendConfigFilePath = exports.getBackendConfigFilePath = exports.getProviderInfoFilePath = exports.getLocalEnvFilePath = exports.getProjectConfigFilePath = exports.getGitIgnoreFilePath = exports.getAmplifyRcFilePath = exports.getCurrentCloudBackendDirPath = exports.getBackendDirPath = exports.getDotConfigDirPath = exports.getAmplifyDirPath = exports.getHomeDotAmplifyDirPath = exports.searchProjectRootPath = void 0;
const path = __importStar(require('path'));
const fs = __importStar(require('fs-extra'));
const os_1 = require('os');
const constants_1 = require('./constants');
const amplify_cli_core_1 = require('amplify-cli-core');
function projectPathValidate(projectPath) {
  let isGood = false;
  if (fs.existsSync(projectPath)) {
    const amplifyDirPath = getAmplifyDirPath(projectPath);
    const infoSubDirPath = getDotConfigDirPath(projectPath);
    isGood = fs.existsSync(amplifyDirPath) && fs.existsSync(infoSubDirPath);
  }
  return isGood;
}
function searchProjectRootPath() {
  let result;
  let currentPath = process.cwd();
  do {
    if (projectPathValidate(currentPath)) {
      result = currentPath;
      break;
    } else {
      const parentPath = path.dirname(currentPath);
      if (currentPath === parentPath) {
        break;
      } else {
        currentPath = parentPath;
      }
    }
  } while (true);
  return result;
}
exports.searchProjectRootPath = searchProjectRootPath;
function getHomeDotAmplifyDirPath() {
  return path.join(os_1.homedir(), constants_1.amplifyCLIConstants.DotAmplifyDirName);
}
exports.getHomeDotAmplifyDirPath = getHomeDotAmplifyDirPath;
function getAmplifyDirPath(projectPath) {
  if (!projectPath) {
    projectPath = searchProjectRootPath();
  }
  if (projectPath) {
    return path.normalize(path.join(projectPath, constants_1.amplifyCLIConstants.AmplifyCLIDirName));
  }
  throw new amplify_cli_core_1.NotInitializedError();
}
exports.getAmplifyDirPath = getAmplifyDirPath;
function getDotConfigDirPath(projectPath) {
  return path.normalize(path.join(getAmplifyDirPath(projectPath), constants_1.amplifyCLIConstants.DotConfigamplifyCLISubDirName));
}
exports.getDotConfigDirPath = getDotConfigDirPath;
function getBackendDirPath(projectPath) {
  return path.normalize(path.join(getAmplifyDirPath(projectPath), constants_1.amplifyCLIConstants.BackendamplifyCLISubDirName));
}
exports.getBackendDirPath = getBackendDirPath;
function getCurrentCloudBackendDirPath(projectPath) {
  return path.normalize(path.join(getAmplifyDirPath(projectPath), constants_1.amplifyCLIConstants.CurrentCloudBackendamplifyCLISubDirName));
}
exports.getCurrentCloudBackendDirPath = getCurrentCloudBackendDirPath;
function getAmplifyRcFilePath(projectPath) {
  if (!projectPath) {
    projectPath = searchProjectRootPath();
  }
  if (projectPath) {
    return path.normalize(path.join(projectPath, '.amplifyrc'));
  }
  throw new amplify_cli_core_1.NotInitializedError();
}
exports.getAmplifyRcFilePath = getAmplifyRcFilePath;
function getGitIgnoreFilePath(projectPath) {
  if (!projectPath) {
    projectPath = searchProjectRootPath();
  }
  if (projectPath) {
    return path.normalize(path.join(projectPath, '.gitignore'));
  }
  throw new amplify_cli_core_1.NotInitializedError();
}
exports.getGitIgnoreFilePath = getGitIgnoreFilePath;
function getProjectConfigFilePath(projectPath) {
  return path.normalize(path.join(getDotConfigDirPath(projectPath), constants_1.amplifyCLIConstants.ProjectConfigFileName));
}
exports.getProjectConfigFilePath = getProjectConfigFilePath;
function getLocalEnvFilePath(projectPath) {
  return path.normalize(path.join(getDotConfigDirPath(projectPath), constants_1.amplifyCLIConstants.LocalEnvFileName));
}
exports.getLocalEnvFilePath = getLocalEnvFilePath;
function getProviderInfoFilePath(projectPath) {
  return path.normalize(path.join(getAmplifyDirPath(projectPath), constants_1.amplifyCLIConstants.ProviderInfoFileName));
}
exports.getProviderInfoFilePath = getProviderInfoFilePath;
function getBackendConfigFilePath(projectPath) {
  return path.normalize(path.join(getBackendDirPath(projectPath), constants_1.amplifyCLIConstants.BackendConfigFileName));
}
exports.getBackendConfigFilePath = getBackendConfigFilePath;
function getCurrentBackendConfigFilePath(projectPath) {
  return path.normalize(path.join(getCurrentCloudBackendDirPath(projectPath), constants_1.amplifyCLIConstants.BackendConfigFileName));
}
exports.getCurrentBackendConfigFilePath = getCurrentBackendConfigFilePath;
function getAmplifyMetaFilePath(projectPath) {
  return path.normalize(path.join(getBackendDirPath(projectPath), constants_1.amplifyCLIConstants.amplifyMetaFileName));
}
exports.getAmplifyMetaFilePath = getAmplifyMetaFilePath;
function getCurrentAmplifyMetaFilePath(projectPath) {
  return path.normalize(path.join(getCurrentCloudBackendDirPath(projectPath), constants_1.amplifyCLIConstants.amplifyMetaFileName));
}
exports.getCurrentAmplifyMetaFilePath = getCurrentAmplifyMetaFilePath;
//# sourceMappingURL=path-manager.js.map
