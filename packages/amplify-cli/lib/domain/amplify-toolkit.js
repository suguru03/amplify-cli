'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod) if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AmplifyToolkit = void 0;
const path = __importStar(require('path'));
class AmplifyToolkit {
  constructor() {
    this._amplifyHelpersDirPath = path.normalize(path.join(__dirname, '../extensions/amplify-helpers'));
    this.addCleanUpTask = task => {
      this._cleanUpTasks.push(task);
    };
    this.runCleanUpTasks = async context => {
      await Promise.all(this._cleanUpTasks.map(task => task(context)));
    };
    this._cleanUpTasks = new Array();
  }
  get confirmPrompt() {
    this._confirmPrompt = this._confirmPrompt || require(path.join(this._amplifyHelpersDirPath, 'confirm-prompt')).confirmPrompt;
    return this._confirmPrompt;
  }
  get constants() {
    this._constants = this._constants || require(path.join(this._amplifyHelpersDirPath, 'constants')).amplifyCLIConstants;
    return this._constants;
  }
  get constructExeInfo() {
    this._constructExeInfo =
      this._constructExeInfo || require(path.join(this._amplifyHelpersDirPath, 'construct-exeInfo')).constructExeInfo;
    return this._constructExeInfo;
  }
  get copyBatch() {
    this._copyBatch = this._copyBatch || require(path.join(this._amplifyHelpersDirPath, 'copy-batch')).copyBatch;
    return this._copyBatch;
  }
  get crudFlow() {
    this._crudFlow = this._crudFlow || require(path.join(this._amplifyHelpersDirPath, 'permission-flow')).crudFlow;
    return this._crudFlow;
  }
  get deleteProject() {
    this._deleteProject = this._deleteProject || require(path.join(this._amplifyHelpersDirPath, 'delete-project')).deleteProject;
    return this._deleteProject;
  }
  get executeProviderUtils() {
    this._executeProviderUtils =
      this._executeProviderUtils || require(path.join(this._amplifyHelpersDirPath, 'execute-provider-utils')).executeProviderUtils;
    return this._executeProviderUtils;
  }
  get getAllEnvs() {
    this._getAllEnvs = this._getAllEnvs || require(path.join(this._amplifyHelpersDirPath, 'get-all-envs')).getAllEnvs;
    return this._getAllEnvs;
  }
  get getPlugin() {
    this._getPlugin = this._getPlugin || require(path.join(this._amplifyHelpersDirPath, 'get-plugin')).getPlugin;
    return this._getPlugin;
  }
  get getCategoryPluginInfo() {
    this._getCategoryPluginInfo =
      this._getCategoryPluginInfo || require(path.join(this._amplifyHelpersDirPath, 'get-category-pluginInfo')).getCategoryPluginInfo;
    return this._getCategoryPluginInfo;
  }
  get getAllCategoryPluginInfo() {
    this._getAllCategoryPluginInfo =
      this._getAllCategoryPluginInfo ||
      require(path.join(this._amplifyHelpersDirPath, 'get-all-category-pluginInfos')).getAllCategoryPluginInfo;
    return this._getAllCategoryPluginInfo;
  }
  get getFrontendPlugins() {
    this._getFrontendPlugins =
      this._getFrontendPlugins || require(path.join(this._amplifyHelpersDirPath, 'get-frontend-plugins')).getFrontendPlugins;
    return this._getFrontendPlugins;
  }
  get getProviderPlugins() {
    this._getProviderPlugins =
      this._getProviderPlugins || require(path.join(this._amplifyHelpersDirPath, 'get-provider-plugins')).getProviderPlugins;
    return this._getProviderPlugins;
  }
  get getEnvDetails() {
    this._getEnvDetails = this._getEnvDetails || require(path.join(this._amplifyHelpersDirPath, 'get-env-details')).getEnvDetails;
    return this._getEnvDetails;
  }
  get getEnvInfo() {
    this._getEnvInfo = this._getEnvInfo || require(path.join(this._amplifyHelpersDirPath, 'get-env-info')).getEnvInfo;
    return this._getEnvInfo;
  }
  get getPluginInstance() {
    this._getPluginInstance =
      this._getPluginInstance || require(path.join(this._amplifyHelpersDirPath, 'get-plugin-instance')).getPluginInstance;
    return this._getPluginInstance;
  }
  get getProjectConfig() {
    this._getProjectConfig =
      this._getProjectConfig || require(path.join(this._amplifyHelpersDirPath, 'get-project-config')).getProjectConfig;
    return this._getProjectConfig;
  }
  get getProjectDetails() {
    this._getProjectDetails =
      this._getProjectDetails || require(path.join(this._amplifyHelpersDirPath, 'get-project-details')).getProjectDetails;
    return this._getProjectDetails;
  }
  get getProjectMeta() {
    this._getProjectMeta = this._getProjectMeta || require(path.join(this._amplifyHelpersDirPath, 'get-project-meta')).getProjectMeta;
    return this._getProjectMeta;
  }
  get getResourceStatus() {
    this._getResourceStatus =
      this._getResourceStatus || require(path.join(this._amplifyHelpersDirPath, 'resource-status')).getResourceStatus;
    return this._getResourceStatus;
  }
  get getResourceOutputs() {
    this._getResourceOutputs =
      this._getResourceOutputs || require(path.join(this._amplifyHelpersDirPath, 'get-resource-outputs')).getResourceOutputs;
    return this._getResourceOutputs;
  }
  get getWhen() {
    this._getWhen = this._getWhen || require(path.join(this._amplifyHelpersDirPath, 'get-when-function')).getWhen;
    return this._getWhen;
  }
  get inputValidation() {
    this._inputValidation = this._inputValidation || require(path.join(this._amplifyHelpersDirPath, 'input-validation')).inputValidation;
    return this._inputValidation;
  }
  get listCategories() {
    this._listCategories = this._listCategories || require(path.join(this._amplifyHelpersDirPath, 'list-categories')).listCategories;
    return this._listCategories;
  }
  get makeId() {
    this._makeId = this._makeId || require(path.join(this._amplifyHelpersDirPath, 'make-id')).makeId;
    return this._makeId;
  }
  get openEditor() {
    this._openEditor = this._openEditor || require(path.join(this._amplifyHelpersDirPath, 'open-editor')).openEditor;
    return this._openEditor;
  }
  get onCategoryOutputsChange() {
    this._onCategoryOutputsChange =
      this._onCategoryOutputsChange ||
      require(path.join(this._amplifyHelpersDirPath, 'on-category-outputs-change')).onCategoryOutputsChange;
    return this._onCategoryOutputsChange;
  }
  get pathManager() {
    this._pathManager = this._pathManager || require(path.join(this._amplifyHelpersDirPath, 'path-manager'));
    return this._pathManager;
  }
  get pressEnterToContinue() {
    this._pressEnterToContinue = this._pressEnterToContinue || require(path.join(this._amplifyHelpersDirPath, 'press-enter-to-continue'));
    return this._pressEnterToContinue;
  }
  get pushResources() {
    this._pushResources = this._pushResources || require(path.join(this._amplifyHelpersDirPath, 'push-resources')).pushResources;
    return this._pushResources;
  }
  get storeCurrentCloudBackend() {
    this._storeCurrentCloudBackend =
      this._storeCurrentCloudBackend || require(path.join(this._amplifyHelpersDirPath, 'push-resources')).storeCurrentCloudBackend;
    return this._storeCurrentCloudBackend;
  }
  get readJsonFile() {
    this._readJsonFile = this._readJsonFile || require(path.join(this._amplifyHelpersDirPath, 'read-json-file')).readJsonFile;
    return this._readJsonFile;
  }
  get removeEnvFromCloud() {
    this._removeEnvFromCloud =
      this._removeEnvFromCloud || require(path.join(this._amplifyHelpersDirPath, 'remove-env-from-cloud')).removeEnvFromCloud;
    return this._removeEnvFromCloud;
  }
  get removeResource() {
    this._removeResource = this._removeResource || require(path.join(this._amplifyHelpersDirPath, 'remove-resource')).removeResource;
    return this._removeResource;
  }
  get sharedQuestions() {
    this._sharedQuestions = this._sharedQuestions || require(path.join(this._amplifyHelpersDirPath, 'shared-questions')).sharedQuestions;
    return this._sharedQuestions;
  }
  get showHelp() {
    this._showHelp = this._showHelp || require(path.join(this._amplifyHelpersDirPath, 'show-help')).showHelp;
    return this._showHelp;
  }
  get showAllHelp() {
    this._showAllHelp = this._showAllHelp || require(path.join(this._amplifyHelpersDirPath, 'show-all-help')).showAllHelp;
    return this._showAllHelp;
  }
  get showHelpfulProviderLinks() {
    this._showHelpfulProviderLinks =
      this._showHelpfulProviderLinks ||
      require(path.join(this._amplifyHelpersDirPath, 'show-helpful-provider-links')).showHelpfulProviderLinks;
    return this._showHelpfulProviderLinks;
  }
  get showResourceTable() {
    this._showResourceTable =
      this._showResourceTable || require(path.join(this._amplifyHelpersDirPath, 'resource-status')).showResourceTable;
    return this._showResourceTable;
  }
  get serviceSelectionPrompt() {
    this._serviceSelectionPrompt =
      this._serviceSelectionPrompt || require(path.join(this._amplifyHelpersDirPath, 'service-select-prompt')).serviceSelectionPrompt;
    return this._serviceSelectionPrompt;
  }
  get updateProjectConfig() {
    this._updateProjectConfig =
      this._updateProjectConfig || require(path.join(this._amplifyHelpersDirPath, 'update-project-config')).updateProjectConfig;
    return this._updateProjectConfig;
  }
  get updateamplifyMetaAfterResourceUpdate() {
    this._updateamplifyMetaAfterResourceUpdate =
      this._updateamplifyMetaAfterResourceUpdate ||
      require(path.join(this._amplifyHelpersDirPath, 'update-amplify-meta')).updateamplifyMetaAfterResourceUpdate;
    return this._updateamplifyMetaAfterResourceUpdate;
  }
  get updateamplifyMetaAfterResourceAdd() {
    this._updateamplifyMetaAfterResourceAdd =
      this._updateamplifyMetaAfterResourceAdd ||
      require(path.join(this._amplifyHelpersDirPath, 'update-amplify-meta')).updateamplifyMetaAfterResourceAdd;
    return this._updateamplifyMetaAfterResourceAdd;
  }
  get updateamplifyMetaAfterResourceDelete() {
    this._updateamplifyMetaAfterResourceDelete =
      this._updateamplifyMetaAfterResourceDelete ||
      require(path.join(this._amplifyHelpersDirPath, 'update-amplify-meta')).updateamplifyMetaAfterResourceDelete;
    return this._updateamplifyMetaAfterResourceDelete;
  }
  get updateProvideramplifyMeta() {
    this._updateProvideramplifyMeta =
      this._updateProvideramplifyMeta || require(path.join(this._amplifyHelpersDirPath, 'update-amplify-meta')).updateProvideramplifyMeta;
    return this._updateProvideramplifyMeta;
  }
  get updateamplifyMetaAfterPush() {
    this._updateamplifyMetaAfterPush =
      this._updateamplifyMetaAfterPush || require(path.join(this._amplifyHelpersDirPath, 'update-amplify-meta')).updateamplifyMetaAfterPush;
    return this._updateamplifyMetaAfterPush;
  }
  get updateamplifyMetaAfterBuild() {
    this._updateamplifyMetaAfterBuild =
      this._updateamplifyMetaAfterBuild ||
      require(path.join(this._amplifyHelpersDirPath, 'update-amplify-meta')).updateamplifyMetaAfterBuild;
    return this._updateamplifyMetaAfterBuild;
  }
  get updateAmplifyMetaAfterPackage() {
    this._updateAmplifyMetaAfterPackage =
      this._updateAmplifyMetaAfterPackage ||
      require(path.join(this._amplifyHelpersDirPath, 'update-amplify-meta')).updateAmplifyMetaAfterPackage;
    return this._updateAmplifyMetaAfterPackage;
  }
  get updateBackendConfigAfterResourceAdd() {
    this._updateBackendConfigAfterResourceAdd =
      this._updateBackendConfigAfterResourceAdd ||
      require(path.join(this._amplifyHelpersDirPath, 'update-backend-config')).updateBackendConfigAfterResourceAdd;
    return this._updateBackendConfigAfterResourceAdd;
  }
  get updateBackendConfigAfterResourceUpdate() {
    this._updateBackendConfigAfterResourceUpdate =
      this._updateBackendConfigAfterResourceUpdate ||
      require(path.join(this._amplifyHelpersDirPath, 'update-backend-config')).updateBackendConfigAfterResourceUpdate;
    return this._updateBackendConfigAfterResourceUpdate;
  }
  get updateBackendConfigAfterResourceRemove() {
    this._updateBackendConfigAfterResourceRemove =
      this._updateBackendConfigAfterResourceRemove ||
      require(path.join(this._amplifyHelpersDirPath, 'update-backend-config')).updateBackendConfigAfterResourceRemove;
    return this._updateBackendConfigAfterResourceRemove;
  }
  get loadEnvResourceParameters() {
    this._loadEnvResourceParameters =
      this._loadEnvResourceParameters || require(path.join(this._amplifyHelpersDirPath, 'envResourceParams')).loadEnvResourceParameters;
    return this._loadEnvResourceParameters;
  }
  get saveEnvResourceParameters() {
    this._saveEnvResourceParameters =
      this._saveEnvResourceParameters || require(path.join(this._amplifyHelpersDirPath, 'envResourceParams')).saveEnvResourceParameters;
    return this._saveEnvResourceParameters;
  }
  get removeResourceParameters() {
    this._removeResourceParameters =
      this._removeResourceParameters || require(path.join(this._amplifyHelpersDirPath, 'envResourceParams')).removeResourceParameters;
    return this._removeResourceParameters;
  }
  get removeDeploymentSecrets() {
    this._removeDeploymentSecrets =
      this._removeDeploymentSecrets || require(path.join(this._amplifyHelpersDirPath, 'envResourceParams')).removeDeploymentSecrets;
    return this._removeDeploymentSecrets;
  }
  get triggerFlow() {
    this._triggerFlow = this._triggerFlow || require(path.join(this._amplifyHelpersDirPath, 'trigger-flow')).triggerFlow;
    return this._triggerFlow;
  }
  get addTrigger() {
    this._addTrigger = this._addTrigger || require(path.join(this._amplifyHelpersDirPath, 'trigger-flow')).addTrigger;
    return this._addTrigger;
  }
  get updateTrigger() {
    this._updateTrigger = this._updateTrigger || require(path.join(this._amplifyHelpersDirPath, 'trigger-flow')).updateTrigger;
    return this._updateTrigger;
  }
  get deleteTrigger() {
    this._deleteTrigger = this._deleteTrigger || require(path.join(this._amplifyHelpersDirPath, 'trigger-flow')).deleteTrigger;
    return this._deleteTrigger;
  }
  get deleteAllTriggers() {
    this._deleteAllTriggers = this._deleteAllTriggers || require(path.join(this._amplifyHelpersDirPath, 'trigger-flow')).deleteAllTriggers;
    return this._deleteAllTriggers;
  }
  get deleteDeselectedTriggers() {
    this._deleteDeselectedTriggers =
      this._deleteDeselectedTriggers || require(path.join(this._amplifyHelpersDirPath, 'trigger-flow')).deleteDeselectedTriggers;
    return this._deleteDeselectedTriggers;
  }
  get dependsOnBlock() {
    this._dependsOnBlock = this._dependsOnBlock || require(path.join(this._amplifyHelpersDirPath, 'trigger-flow')).dependsOnBlock;
    return this._dependsOnBlock;
  }
  get getTags() {
    this._getTags = this._getTags || require(path.join(this._amplifyHelpersDirPath, 'get-tags')).getTags;
    return this._getTags;
  }
  get getTriggerMetadata() {
    this._getTriggerMetadata =
      this._getTriggerMetadata || require(path.join(this._amplifyHelpersDirPath, 'trigger-flow')).getTriggerMetadata;
    return this._getTriggerMetadata;
  }
  get getTriggerPermissions() {
    this._getTriggerPermissions =
      this._getTriggerPermissions || require(path.join(this._amplifyHelpersDirPath, 'trigger-flow')).getTriggerPermissions;
    return this._getTriggerPermissions;
  }
  get getTriggerEnvVariables() {
    this._getTriggerEnvVariables =
      this._getTriggerEnvVariables || require(path.join(this._amplifyHelpersDirPath, 'trigger-flow')).getTriggerEnvVariables;
    return this._getTriggerEnvVariables;
  }
  get getTriggerEnvInputs() {
    this._getTriggerEnvInputs =
      this._getTriggerEnvInputs || require(path.join(this._amplifyHelpersDirPath, 'trigger-flow')).getTriggerEnvInputs;
    return this._getTriggerEnvInputs;
  }
  get getUserPoolGroupList() {
    this._getUserPoolGroupList =
      this._getUserPoolGroupList || require(path.join(this._amplifyHelpersDirPath, 'get-userpoolgroup-list')).getUserPoolGroupList;
    return this._getUserPoolGroupList;
  }
  get forceRemoveResource() {
    this._forceRemoveResource =
      this._forceRemoveResource || require(path.join(this._amplifyHelpersDirPath, 'remove-resource')).forceRemoveResource;
    return this._forceRemoveResource;
  }
  get writeObjectAsJson() {
    this._writeObjectAsJson =
      this._writeObjectAsJson || require(path.join(this._amplifyHelpersDirPath, 'write-object-as-json')).writeObjectAsJson;
    return this._writeObjectAsJson;
  }
  get hashDir() {
    this._hashDir = this._hashDir || require(path.join(this._amplifyHelpersDirPath, 'hash-dir')).hashDir;
    return this._hashDir;
  }
  get leaveBreadcrumbs() {
    this._leaveBreadcrumbs =
      this._leaveBreadcrumbs || require(path.join(this._amplifyHelpersDirPath, 'leave-breadcrumbs')).leaveBreadcrumbs;
    return this._leaveBreadcrumbs;
  }
  get readBreadcrumbs() {
    this._readBreadcrumbs = this._readBreadcrumbs || require(path.join(this._amplifyHelpersDirPath, 'read-breadcrumbs')).readBreadcrumbs;
    return this._readBreadcrumbs;
  }
  get loadRuntimePlugin() {
    this._loadRuntimePlugin =
      this._loadRuntimePlugin || require(path.join(this._amplifyHelpersDirPath, 'load-runtime-plugin')).loadRuntimePlugin;
    return this._loadRuntimePlugin;
  }
  get getImportedAuthProperties() {
    this._getImportedAuthProperties =
      this._getImportedAuthProperties ||
      require(path.join(this._amplifyHelpersDirPath, 'get-imported-auth-properties')).getImportedAuthProperties;
    return this._getImportedAuthProperties;
  }
  get invokePluginMethod() {
    this._invokePluginMethod =
      this._invokePluginMethod || require(path.join(this._amplifyHelpersDirPath, 'invoke-plugin-method')).invokePluginMethod;
    return this._invokePluginMethod;
  }
}
exports.AmplifyToolkit = AmplifyToolkit;
//# sourceMappingURL=amplify-toolkit.js.map
