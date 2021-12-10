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
exports.preInitSetup = void 0;
const fs = __importStar(require('fs-extra'));
const url = __importStar(require('url'));
const child_process_1 = require('child_process');
const amplify_cli_core_1 = require('amplify-cli-core');
const packageManagerHelpers_1 = require('../packageManagerHelpers');
const packageManagerHelpers_2 = require('../packageManagerHelpers');
const s9_onSuccess_1 = require('./s9-onSuccess');
async function preInitSetup(context) {
  if (context.parameters.options.app) {
    context.print.warning('Note: Amplify does not have knowledge of the url provided');
    const repoUrl = context.parameters.options.app;
    await validateGithubRepo(context, repoUrl);
    await cloneRepo(context, repoUrl);
    await installPackage();
    await setLocalEnvDefaults(context);
  }
  return context;
}
exports.preInitSetup = preInitSetup;
async function validateGithubRepo(context, repoUrl) {
  try {
    url.parse(repoUrl);
    child_process_1.execSync(`git ls-remote ${repoUrl}`, { stdio: 'ignore' });
  } catch (e) {
    context.print.error('Invalid remote github url');
    await context.usageData.emitError(e);
    amplify_cli_core_1.exitOnNextTick(1);
  }
}
async function cloneRepo(context, repoUrl) {
  const files = fs.readdirSync(process.cwd());
  if (files.length > 0) {
    const errMessage = 'Please ensure you run this command in an empty directory';
    context.print.error(errMessage);
    await context.usageData.emitError(new amplify_cli_core_1.NonEmptyDirectoryError(errMessage));
    amplify_cli_core_1.exitOnNextTick(1);
  }
  try {
    child_process_1.execSync(`git clone ${repoUrl} .`, { stdio: 'inherit' });
  } catch (e) {
    await context.usageData.emitError(e);
    amplify_cli_core_1.exitOnNextTick(1);
  }
}
async function installPackage() {
  const packageManager = await packageManagerHelpers_1.getPackageManager();
  const normalizedPackageManager = await packageManagerHelpers_2.normalizePackageManagerForOS(packageManager);
  if (normalizedPackageManager) {
    child_process_1.execSync(`${normalizedPackageManager} install`, { stdio: 'inherit' });
  }
}
async function setLocalEnvDefaults(context) {
  const projectPath = process.cwd();
  const defaultEditor = 'vscode';
  const envName = 'sampledev';
  context.print.warning(`Setting default editor to ${defaultEditor}`);
  context.print.warning(`Setting environment to ${envName}`);
  context.print.warning('Run amplify configure project to change the default configuration later');
  context.exeInfo.localEnvInfo = {
    projectPath,
    defaultEditor,
    envName,
  };
  context.exeInfo.inputParams.amplify.envName = envName;
  await s9_onSuccess_1.generateLocalEnvInfoFile(context);
}
//# sourceMappingURL=preInitSetup.js.map
