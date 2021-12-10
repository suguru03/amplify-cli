'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.removeEnvFromCloud = void 0;
const get_project_config_1 = require('./get-project-config');
const get_all_category_pluginInfos_1 = require('./get-all-category-pluginInfos');
const get_provider_plugins_1 = require('./get-provider-plugins');
async function removeEnvFromCloud(context, envName, deleteS3) {
  const { providers } = get_project_config_1.getProjectConfig();
  const providerPlugins = get_provider_plugins_1.getProviderPlugins(context);
  const providerPromises = [];
  context.print.info('');
  context.print.info(`Deleting env:${envName}`);
  const categoryPluginInfoList = get_all_category_pluginInfos_1.getAllCategoryPluginInfo(context);
  if (categoryPluginInfoList.notifications) {
    const notificationsModule = require(categoryPluginInfoList.notifications[0].packageLocation);
    await notificationsModule.deletePinpointAppForEnv(context, envName);
  }
  providers.forEach(providerName => {
    const pluginModule = require(providerPlugins[providerName]);
    providerPromises.push(pluginModule.deleteEnv(context, envName, deleteS3));
  });
  try {
    await Promise.all(providerPromises);
  } catch (e) {
    context.print.info('');
    context.print.error(`Error in deleting env:${envName}`);
    context.print.info(e.message);
    throw e;
  }
}
exports.removeEnvFromCloud = removeEnvFromCloud;
//# sourceMappingURL=remove-env-from-cloud.js.map
