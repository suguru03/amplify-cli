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
exports.normalizePackageManagerForOS = exports.getPackageManagerCommand = exports.getPackageManager = void 0;
const path = __importStar(require('path'));
const fs = __importStar(require('fs-extra'));
const which = __importStar(require('which'));
const _ = __importStar(require('lodash'));
const amplify_cli_core_1 = require('amplify-cli-core');
const packageJson = 'package.json';
const packageJsonDir = path.join(process.cwd(), packageJson);
const initializationScripts = ['start', 'serve'];
const MISSING_SCRIPTS_ERROR = new Error(
  'Did not find a "start" or "serve" initialization script. Add a package.json file in the root of the project with one of these scripts.',
);
async function getPackageManager() {
  const yarnLock = './yarn.lock';
  const yarnLockDir = path.join(process.cwd(), yarnLock);
  if (fs.existsSync(yarnLockDir)) {
    if (which.sync('yarn', { nothrow: true }) || which.sync('yarn.cmd', { nothrow: true })) {
      return 'yarn';
    }
    return 'npm';
  } else if (fs.existsSync(packageJsonDir)) {
    return 'npm';
  }
  return undefined;
}
exports.getPackageManager = getPackageManager;
async function getPackageManagerCommand() {
  const scripts = _.get(amplify_cli_core_1.JSONUtilities.readJson(packageJsonDir, { throwIfNotExist: false }), 'scripts');
  return (
    _.keys(scripts).find(scriptName => initializationScripts.includes(scriptName)) ||
    (() => {
      throw MISSING_SCRIPTS_ERROR;
    })()
  );
}
exports.getPackageManagerCommand = getPackageManagerCommand;
async function normalizePackageManagerForOS(packageManager) {
  const isOnWindows = /^win/.test(process.platform);
  if (isOnWindows) {
    if (packageManager === 'yarn') {
      return 'yarn.cmd';
    } else if (!packageManager) {
      return undefined;
    }
    return 'npm.cmd';
  }
  return packageManager;
}
exports.normalizePackageManagerForOS = normalizePackageManagerForOS;
//# sourceMappingURL=packageManagerHelpers.js.map
