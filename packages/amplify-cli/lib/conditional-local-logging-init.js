'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.logInput = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
const amplify_cli_logger_1 = require('amplify-cli-logger');
function logInput(input) {
  amplify_cli_logger_1.logger.logInfo({
    message: `amplify ${input.command ? input.command : ''} \
${input.plugin ? input.plugin : ''} \
${input.subCommands ? input.subCommands.join(' ') : ''} \
${input.options ? amplify_cli_logger_1.Redactor(amplify_cli_core_1.JSONUtilities.stringify(input.options, { minify: true })) : ''}`,
  });
}
exports.logInput = logInput;
//# sourceMappingURL=conditional-local-logging-init.js.map
