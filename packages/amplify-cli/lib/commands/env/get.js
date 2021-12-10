'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.run = void 0;
const chalk_1 = __importDefault(require('chalk'));
const amplify_cli_core_1 = require('amplify-cli-core');
const envUtils_1 = require('../helpers/envUtils');
const run = async context => {
  const envName = context.parameters.options.name;
  if (!envName) {
    const errMessage = 'You must pass in the name of the environment using the --name flag';
    context.print.error(errMessage);
    context.usageData.emitError(new amplify_cli_core_1.UnknownArgumentError(errMessage));
    amplify_cli_core_1.exitOnNextTick(1);
  }
  const allEnvs = context.amplify.getEnvDetails();
  if (context.parameters.options.json) {
    if (allEnvs[envName]) {
      context.print.fancy(amplify_cli_core_1.JSONUtilities.stringify(allEnvs[envName]));
    } else {
      context.print.fancy(amplify_cli_core_1.JSONUtilities.stringify({ error: `No environment found with name: '${envName}'` }));
    }
    return;
  }
  let envFound = false;
  Object.keys(allEnvs).forEach(env => {
    if (env === envName) {
      envFound = true;
      context.print.info('');
      context.print.info(chalk_1.default.red(env));
      envUtils_1.printEnvInfo(context, env, allEnvs);
    }
  });
  if (!envFound) {
    context.print.error('No environment found with the corresponding name provided');
  }
};
exports.run = run;
//# sourceMappingURL=get.js.map
