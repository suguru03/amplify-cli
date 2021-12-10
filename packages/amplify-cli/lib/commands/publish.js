'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.run = void 0;
const push_1 = require('./push');
const amplify_cli_core_1 = require('amplify-cli-core');
const run = async context => {
  context.amplify.constructExeInfo(context);
  const { amplifyMeta } = context.exeInfo;
  const isHostingAdded = amplifyMeta.hosting && Object.keys(amplifyMeta.hosting).length > 0;
  if (!isHostingAdded) {
    context.print.info('');
    context.print.error('Please add hosting to your project before publishing your project');
    context.print.info('Command: amplify hosting add');
    context.print.info('');
    return;
  }
  let isHostingAlreadyPushed = false;
  Object.keys(amplifyMeta.hosting).every(hostingService => {
    let continueToCheckNext = true;
    if (amplifyMeta.hosting[hostingService].lastPushTimeStamp) {
      const lastPushTime = new Date(amplifyMeta.hosting[hostingService].lastPushTimeStamp).getTime();
      if (lastPushTime < Date.now()) {
        isHostingAlreadyPushed = true;
        continueToCheckNext = false;
      }
    }
    return continueToCheckNext;
  });
  const didPush = await push_1.run(context);
  let continueToPublish = didPush;
  if (!continueToPublish && isHostingAlreadyPushed) {
    context.print.info('');
    continueToPublish = await context.amplify.confirmPrompt('Do you still want to publish the frontend?');
  }
  try {
    if (continueToPublish) {
      const frontendPlugins = context.amplify.getFrontendPlugins(context);
      const frontendHandlerModule = require(frontendPlugins[context.exeInfo.projectConfig.frontend]);
      await frontendHandlerModule.publish(context);
    }
  } catch (e) {
    context.print.error(`An error occurred during the publish operation: ${e.message || 'Unknown error occurred.'}`);
    await context.usageData.emitError(new amplify_cli_core_1.FrontendBuildError(e.message));
    process.exit(1);
  }
};
exports.run = run;
//# sourceMappingURL=publish.js.map
