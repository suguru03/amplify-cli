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
exports.getGlobalNodeModuleDirPath = void 0;
const os = __importStar(require('os'));
const path = __importStar(require('path'));
const global_prefix_1 = __importDefault(require('global-prefix'));
function getGlobalNodeModuleDirPath() {
  const yarnPrefix = getYarnPrefix();
  if (__dirname.includes(yarnPrefix)) {
    return path.join(yarnPrefix, 'node_modules');
  }
  if (process.platform === 'win32') {
    return path.join(global_prefix_1.default, 'node_modules');
  }
  return path.join(global_prefix_1.default, 'lib', 'node_modules');
}
exports.getGlobalNodeModuleDirPath = getGlobalNodeModuleDirPath;
function getYarnPrefix() {
  const home = os.homedir();
  let yarnPrefix = path.join(home, '.config', 'yarn', 'global');
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    yarnPrefix = path.join(process.env.LOCALAPPDATA, 'Yarn', 'config', 'global');
  }
  return yarnPrefix;
}
//# sourceMappingURL=global-prefix.js.map
