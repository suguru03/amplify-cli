'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getAmplifyAppId = void 0;
const get_project_meta_1 = require('./get-project-meta');
function getAmplifyAppId() {
  const meta = get_project_meta_1.getProjectMeta();
  if (meta.providers && meta.providers.awscloudformation) {
    return meta.providers.awscloudformation.AmplifyAppId;
  }
}
exports.getAmplifyAppId = getAmplifyAppId;
//# sourceMappingURL=get-amplify-appId.js.map
