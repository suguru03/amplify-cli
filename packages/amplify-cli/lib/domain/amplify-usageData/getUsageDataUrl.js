'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getUrl = exports.prodUrl = void 0;
const url_1 = __importDefault(require('url'));
const VersionManager_1 = require('./VersionManager');
const version = VersionManager_1.getLatestApiVersion();
exports.prodUrl = `https://api.cli.amplify.aws/${version}/metrics`;
function getUrl() {
  if (process.env.AMPLIFY_CLI_BETA_USAGE_TRACKING_URL && typeof process.env.AMPLIFY_CLI_BETA_USAGE_TRACKING_URL === 'string')
    return url_1.default.parse(process.env.AMPLIFY_CLI_BETA_USAGE_TRACKING_URL || '');
  return url_1.default.parse(exports.prodUrl);
}
exports.getUrl = getUrl;
//# sourceMappingURL=getUsageDataUrl.js.map
