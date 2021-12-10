'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.run = void 0;
const preInitSetup_1 = require('../init-steps/preInitSetup');
const postInitSetup_1 = require('../init-steps/postInitSetup');
const s0_analyzeProject_1 = require('../init-steps/s0-analyzeProject');
const s1_initFrontend_1 = require('../init-steps/s1-initFrontend');
const s2_initProviders_1 = require('../init-steps/s2-initProviders');
const s8_scaffoldHeadless_1 = require('../init-steps/s8-scaffoldHeadless');
const s9_onFailure_1 = require('../init-steps/s9-onFailure');
const s9_onSuccess_1 = require('../init-steps/s9-onSuccess');
const amplify_service_helper_1 = require('../amplify-service-helper');
function constructExeInfo(context) {
  context.exeInfo = {
    inputParams: amplify_service_helper_1.constructInputParams(context),
  };
}
const runStrategy = quickstart => {
  return quickstart
    ? [
        preInitSetup_1.preInitSetup,
        s0_analyzeProject_1.analyzeProjectHeadless,
        s8_scaffoldHeadless_1.scaffoldProjectHeadless,
        s9_onSuccess_1.onHeadlessSuccess,
      ]
    : [
        preInitSetup_1.preInitSetup,
        s0_analyzeProject_1.analyzeProject,
        s1_initFrontend_1.initFrontend,
        s2_initProviders_1.initProviders,
        s9_onSuccess_1.onSuccess,
        postInitSetup_1.postInitSetup,
      ];
};
const run = async context => {
  var _a, _b;
  constructExeInfo(context);
  const steps = runStrategy(
    (_b = (_a = context === null || context === void 0 ? void 0 : context.parameters) === null || _a === void 0 ? void 0 : _a.options) ===
      null || _b === void 0
      ? void 0
      : _b.quickstart,
  );
  try {
    for (const step of steps) {
      await step(context);
    }
  } catch (e) {
    context.usageData.emitError(e);
    s9_onFailure_1.onFailure(e);
  }
};
exports.run = run;
//# sourceMappingURL=init.js.map
