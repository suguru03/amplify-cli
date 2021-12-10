'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getProviderPlugins = void 0;
function getProviderPlugins(context) {
  const providers = {};
  context.runtime.plugins.forEach(plugin => {
    if (plugin.pluginType === 'provider') {
      providers[plugin.pluginName] = plugin.directory;
    }
  });
  return providers;
}
exports.getProviderPlugins = getProviderPlugins;
//# sourceMappingURL=get-provider-plugins.js.map
