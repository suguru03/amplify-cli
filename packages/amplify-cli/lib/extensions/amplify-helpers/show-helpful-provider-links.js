'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.showHelpfulProviderLinks = void 0;
const get_project_config_1 = require('./get-project-config');
const resource_status_1 = require('./resource-status');
const get_provider_plugins_1 = require('./get-provider-plugins');
async function showHelpfulProviderLinks(context) {
  const { providers } = get_project_config_1.getProjectConfig();
  const providerPlugins = get_provider_plugins_1.getProviderPlugins(context);
  const providerPromises = [];
  const { allResources } = await resource_status_1.getResourceStatus();
  providers.forEach(providerName => {
    const pluginModule = require(providerPlugins[providerName]);
    providerPromises.push(pluginModule.showHelpfulLinks(context, allResources));
  });
  return Promise.all(providerPromises);
}
exports.showHelpfulProviderLinks = showHelpfulProviderLinks;
//# sourceMappingURL=show-helpful-provider-links.js.map
