'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.NoUsageData = void 0;
class NoUsageData {
  emitError(error) {
    return Promise.resolve();
  }
  emitInvoke() {
    return Promise.resolve();
  }
  emitAbort() {
    return Promise.resolve();
  }
  emitSuccess() {
    return Promise.resolve();
  }
  init(installationUuid, version, input, accountId) {}
  static get Instance() {
    if (!NoUsageData.instance) NoUsageData.instance = new NoUsageData();
    return NoUsageData.instance;
  }
}
exports.NoUsageData = NoUsageData;
//# sourceMappingURL=NoUsageData.js.map
