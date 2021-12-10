'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.postInitSetup = void 0;
const child_process_1 = require('child_process');
const packageManagerHelpers_1 = require('../packageManagerHelpers');
const amplify_cli_core_1 = require('amplify-cli-core');
async function postInitSetup(context) {
  if (context.parameters.options.app) {
    try {
      context.parameters.options.app = true;
      context.parameters.options.y = true;
      context.amplify.constructExeInfo(context);
      await context.amplify.pushResources(context);
      await runPackage();
    } catch (e) {
      if (e.name !== 'InvalidDirectiveError') {
        context.print.error(`An error occurred during the push operation: ${e.message}`);
      }
      await context.usageData.emitError(e);
      amplify_cli_core_1.exitOnNextTick(1);
    }
  }
}
exports.postInitSetup = postInitSetup;
async function runPackage() {
  const packageManager = await packageManagerHelpers_1.getPackageManager();
  const normalizedPackageManager = await packageManagerHelpers_1.normalizePackageManagerForOS(packageManager);
  const packageCommand = await packageManagerHelpers_1.getPackageManagerCommand();
  if (normalizedPackageManager) {
    child_process_1.execSync(`${normalizedPackageManager} ${packageCommand}`, { stdio: 'inherit' });
  }
}
//# sourceMappingURL=postInitSetup.js.map
