'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.executeProviderUtils = void 0;
const get_provider_plugins_1 = require('./get-provider-plugins');
async function executeProviderUtils(context, providerName, utilName, options) {
  const providerPlugins = get_provider_plugins_1.getProviderPlugins(context);
  const pluginModule = require(providerPlugins[providerName]);
  return pluginModule.providerUtils[utilName](context, options);
}
exports.executeProviderUtils = executeProviderUtils;
//# sourceMappingURL=execute-provider-utils.js.map
