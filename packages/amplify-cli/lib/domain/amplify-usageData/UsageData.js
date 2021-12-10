'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.UsageData = void 0;
const uuid_1 = __importDefault(require('uuid'));
const input_1 = require('../input');
const https_1 = __importDefault(require('https'));
const identifiable_input_regex_1 = __importDefault(require('./identifiable-input-regex'));
const UsageDataPayload_1 = require('./UsageDataPayload');
const getUsageDataUrl_1 = require('./getUsageDataUrl');
const amplify_cli_core_1 = require('amplify-cli-core');
const lodash_1 = __importDefault(require('lodash'));
class UsageData {
  constructor() {
    this.accountId = '';
    this.installationUuid = '';
    this.version = '';
    this.requestTimeout = 100;
    this.sessionUuid = uuid_1.default.v4();
    this.url = getUsageDataUrl_1.getUrl();
    this.input = new input_1.Input([]);
    this.projectSettings = {};
    this.inputOptions = {};
  }
  init(installationUuid, version, input, accountId, projectSettings) {
    this.installationUuid = installationUuid;
    this.accountId = accountId;
    this.projectSettings = projectSettings;
    this.version = version;
    this.inputOptions = input.options ? lodash_1.default.pick(input.options, ['sandboxId']) : {};
    this.input = identifiable_input_regex_1.default(input, true);
  }
  static get Instance() {
    if (!UsageData.instance) UsageData.instance = new UsageData();
    return UsageData.instance;
  }
  emitError(error) {
    return this.emit(error, WorkflowState.Failed);
  }
  emitInvoke() {
    return this.emit(null, WorkflowState.Invoke);
  }
  emitAbort() {
    return this.emit(null, WorkflowState.Aborted);
  }
  emitSuccess() {
    return this.emit(null, WorkflowState.Successful);
  }
  async emit(error, state) {
    const payload = new UsageDataPayload_1.UsageDataPayload(
      this.sessionUuid,
      this.installationUuid,
      this.version,
      this.input,
      error,
      state,
      this.accountId,
      this.projectSettings,
      this.inputOptions,
    );
    return this.send(payload);
  }
  async send(payload) {
    return new Promise((resolve, _) => {
      const data = amplify_cli_core_1.JSONUtilities.stringify(payload, {
        minify: true,
      });
      const req = https_1.default.request({
        hostname: this.url.hostname,
        port: this.url.port,
        path: this.url.path,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'content-length': data.length,
        },
      });
      req.on('error', () => {});
      req.setTimeout(this.requestTimeout, () => {
        resolve();
      });
      req.write(data);
      req.end(() => {
        resolve();
      });
    });
  }
}
exports.UsageData = UsageData;
var WorkflowState;
(function (WorkflowState) {
  WorkflowState['Successful'] = 'SUCCEEDED';
  WorkflowState['Invoke'] = 'INVOKED';
  WorkflowState['Aborted'] = 'ABORTED';
  WorkflowState['Failed'] = 'FAILED';
})(WorkflowState || (WorkflowState = {}));
//# sourceMappingURL=UsageData.js.map
