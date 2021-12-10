'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.run = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
const run = async context => {
  if (Array.isArray(context.parameters.array) && context.parameters.array.length > 0) {
    context.print.error('"delete" command does not expect additional arguments.');
    context.print.error('Perhaps you meant to use the "remove" command instead of "delete"?');
    context.usageData.emitError(new amplify_cli_core_1.UnknownArgumentError());
    amplify_cli_core_1.exitOnNextTick(1);
  }
  await context.amplify.deleteProject(context);
};
exports.run = run;
//# sourceMappingURL=delete.js.map
