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
exports.run = void 0;
const enquirer_1 = require('enquirer');
const amplify_cli_core_1 = require('amplify-cli-core');
const providerName = 'awscloudformation';
const run = async context => {
  let consoleUrl = getDefaultURL();
  try {
    const localEnvInfo = amplify_cli_core_1.stateManager.getLocalEnvInfo(undefined, {
      throwIfNotExist: false,
      default: {},
    });
    const teamProviderInfo = amplify_cli_core_1.stateManager.getTeamProviderInfo(undefined, {
      throwIfNotExist: false,
      default: {},
    });
    const { envName } = localEnvInfo;
    const { Region, AmplifyAppId } = teamProviderInfo[envName][providerName];
    if (envName && AmplifyAppId) {
      consoleUrl = constructStatusURL(Region, AmplifyAppId, envName);
      const providerPlugin = await Promise.resolve().then(() =>
        __importStar(require(context.amplify.getProviderPlugins(context).awscloudformation)),
      );
      if (await providerPlugin.isAmplifyAdminApp(AmplifyAppId)) {
        const { choice } = await enquirer_1.prompt({
          type: 'select',
          name: 'choice',
          message: 'Which site do you want to open?',
          choices: [
            { name: 'Admin', message: 'Amplify admin UI' },
            { name: 'Console', message: 'Amplify console' },
          ],
        });
        if (choice === 'Admin') {
          const providerPlugin = await Promise.resolve().then(() =>
            __importStar(require(context.amplify.getProviderPlugins(context).awscloudformation)),
          );
          const baseUrl = providerPlugin.adminBackendMap[Region].amplifyAdminUrl;
          consoleUrl = constructAdminURL(baseUrl, AmplifyAppId, envName);
        }
      }
    }
  } catch (e) {
    context.print.error(e.message);
    context.usageData.emitError(e);
    process.exitCode = 1;
    return;
  }
  context.print.green(consoleUrl);
  amplify_cli_core_1.open(consoleUrl, { wait: false });
};
exports.run = run;
function constructAdminURL(baseUrl, appId, envName) {
  return `${baseUrl}/admin/${appId}/${envName}/home`;
}
function constructStatusURL(region, appId, envName) {
  const prodURL = `https://${region}.console.aws.amazon.com/amplify/home?region=${region}#/${appId}/YmFja2VuZA/${envName}`;
  return prodURL;
}
function getDefaultURL() {
  const prodURL = `https://console.aws.amazon.com/amplify/home#/create`;
  return prodURL;
}
//# sourceMappingURL=console.js.map
