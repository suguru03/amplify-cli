'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getAllCategoryPluginInfo = void 0;
function getAllCategoryPluginInfo(context) {
  const categoryPluginInfoList = { notifications: [] };
  Object.keys(context.pluginPlatform.plugins).forEach(pluginName => {
    const pluginInfos = context.pluginPlatform.plugins[pluginName].filter(pluginInfo => {
      return pluginInfo.manifest.type === 'category';
    });
    if (pluginInfos.length > 0) {
      categoryPluginInfoList[pluginName] = pluginInfos;
    }
  });
  return categoryPluginInfoList;
}
exports.getAllCategoryPluginInfo = getAllCategoryPluginInfo;
//# sourceMappingURL=get-all-category-pluginInfos.js.map
