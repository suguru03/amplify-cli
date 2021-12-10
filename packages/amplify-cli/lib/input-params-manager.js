'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.normalizeFrontendHandlerName = exports.normalizeProviderName = exports.normalizeInputParams = void 0;
const amplify_cli_core_1 = require('amplify-cli-core');
function normalizeInputParams(context) {
  const inputParams = {};
  Object.keys(context.parameters.options).forEach(key => {
    const normalizedKey = normalizeKey(key);
    const normalizedValue = normalizeValue(context.parameters.options[key]);
    inputParams[normalizedKey] = normalizedValue;
  });
  transform(inputParams);
  return inputParams;
}
exports.normalizeInputParams = normalizeInputParams;
function normalizeKey(key) {
  if (['y', 'yes'].includes(key)) {
    key = 'yes';
  }
  if (['a', 'amplify', 'amplify-config', 'amplifyConfig'].includes(key)) {
    key = 'amplify';
  }
  if (['p', 'provider', 'providers', 'providers-config', 'providersConfig'].includes(key)) {
    key = 'providers';
  }
  if (['f', 'frontend', 'frontend-config', 'frontendConfig'].includes(key)) {
    key = 'frontend';
  }
  return key;
}
function normalizeValue(value) {
  let normalizedValue = value;
  try {
    normalizedValue = amplify_cli_core_1.JSONUtilities.parse(value);
  } catch (e) {}
  return normalizedValue;
}
function transform(inputParams) {
  inputParams.amplify = inputParams.amplify || {};
  inputParams.providers = inputParams.providers || {};
  inputParams.frontend = inputParams.frontend || {};
  inputParams.amplify.providers = Object.keys(inputParams.providers);
  inputParams.amplify.frontend = inputParams.frontend.type || inputParams.frontend.frontend;
  if (inputParams.amplify.frontend) {
    delete inputParams.frontend.type;
    delete inputParams.frontend.frontend;
    inputParams[inputParams.amplify.frontend] = inputParams.frontend;
  }
  if (inputParams.amplify.providers.length > 0) {
    inputParams.amplify.providers.forEach(provider => {
      inputParams[provider] = inputParams.providers[provider];
    });
  }
  delete inputParams.frontend;
  delete inputParams.providers;
}
function normalizeProviderName(name, providerPluginList) {
  if (!providerPluginList || providerPluginList.length < 1) {
    return undefined;
  }
  return providerPluginList.includes(name) ? name : undefined;
}
exports.normalizeProviderName = normalizeProviderName;
function normalizeFrontendHandlerName(name, frontendPluginList) {
  if (!frontendPluginList || frontendPluginList.length < 1) {
    return undefined;
  }
  return frontendPluginList.includes(name) ? name : undefined;
}
exports.normalizeFrontendHandlerName = normalizeFrontendHandlerName;
//# sourceMappingURL=input-params-manager.js.map
