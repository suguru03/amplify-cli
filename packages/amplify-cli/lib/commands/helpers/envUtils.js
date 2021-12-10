'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.printEnvInfo = void 0;
function printEnvInfo(context, env, allEnvs) {
  context.print.info('--------------');
  Object.keys(allEnvs[env])
    .filter(provider => provider !== 'nonCFNdata')
    .filter(provider => provider !== 'categories')
    .forEach(provider => {
      context.print.info(`Provider: ${provider}`);
      Object.keys(allEnvs[env][provider]).forEach(providerAttr => {
        context.print.info(`${providerAttr}: ${allEnvs[env][provider][providerAttr]}`);
      });
      context.print.info('--------------');
      context.print.info('');
    });
  context.print.info('');
}
exports.printEnvInfo = printEnvInfo;
//# sourceMappingURL=envUtils.js.map
