'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.run = void 0;
const run = async context => {
  await context.amplify.showResourceTable();
  await context.amplify.showHelpfulProviderLinks(context);
  await showAmplifyConsoleHostingStatus(context);
};
exports.run = run;
async function showAmplifyConsoleHostingStatus(context) {
  const pluginInfo = context.amplify.getCategoryPluginInfo(context, 'hosting', 'amplifyhosting');
  if (pluginInfo && pluginInfo.packageLocation) {
    const { status } = require(pluginInfo.packageLocation);
    if (status) {
      await status(context);
    }
  }
}
//# sourceMappingURL=status.js.map
