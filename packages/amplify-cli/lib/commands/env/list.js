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
  const { envName } = context.amplify.getEnvInfo();
  if (context.parameters.options.details) {
    const allEnvs = context.amplify.getEnvDetails();
    if (context.parameters.options.json) {
      context.print.fancy(amplify_cli_core_1.JSONUtilities.stringify(allEnvs));
      return;
    }
    Object.keys(allEnvs).forEach(env => {
      context.print.info('');
      if (envName === env) {
        context.print.info(chalk_1.default.red(`*${env}*`));
      } else {
        context.print.info(chalk_1.default.yellow(env));
      }
      envUtils_1.printEnvInfo(context, env, allEnvs);
    });
  } else {
    const allEnvs = context.amplify.getAllEnvs();
    if (context.parameters.options.json) {
      context.print.fancy(amplify_cli_core_1.JSONUtilities.stringify({ envs: allEnvs }));
      return;
    }
    const { table } = context.print;
    const tableOptions = [['Environments']];
    for (let i = 0; i < allEnvs.length; i += 1) {
      if (allEnvs[i] === envName) {
        tableOptions.push([`*${allEnvs[i]}`]);
      } else {
        tableOptions.push([allEnvs[i]]);
      }
    }
    context.print.info('');
    table(tableOptions, { format: 'markdown' });
    context.print.info('');
  }
};
exports.run = run;
//# sourceMappingURL=list.js.map
