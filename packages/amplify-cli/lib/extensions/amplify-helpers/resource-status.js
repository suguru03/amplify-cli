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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.showResourceTable = exports.getResourceStatus = exports.getHashForResourceDir = void 0;
const fs = __importStar(require('fs-extra'));
const path = __importStar(require('path'));
const chalk_1 = __importDefault(require('chalk'));
const lodash_1 = __importDefault(require('lodash'));
const print_1 = require('./print');
const folder_hash_1 = require('folder-hash');
const get_env_info_1 = require('./get-env-info');
const get_cloud_init_status_1 = require('./get-cloud-init-status');
const amplify_category_function_1 = require('amplify-category-function');
const remove_pinpoint_policy_1 = require('../amplify-helpers/remove-pinpoint-policy');
const amplify_cli_core_1 = require('amplify-cli-core');
async function isBackendDirModifiedSinceLastPush(resourceName, category, lastPushTimeStamp, isLambdaLayer = false) {
  if (!lastPushTimeStamp) {
    return false;
  }
  const localBackendDir = path.normalize(path.join(amplify_cli_core_1.pathManager.getBackendDirPath(), category, resourceName));
  const cloudBackendDir = path.normalize(path.join(amplify_cli_core_1.pathManager.getCurrentCloudBackendDirPath(), category, resourceName));
  if (!fs.existsSync(localBackendDir)) {
    return false;
  }
  const hashingFunc = isLambdaLayer ? amplify_category_function_1.hashLayerResource : getHashForResourceDir;
  const localDirHash = await hashingFunc(localBackendDir);
  const cloudDirHash = await hashingFunc(cloudBackendDir);
  return localDirHash !== cloudDirHash;
}
function getHashForResourceDir(dirPath, files) {
  const options = {
    folders: { exclude: ['.*', 'node_modules', 'test_coverage', 'dist', 'build'] },
    files: {
      include: files,
    },
  };
  return folder_hash_1.hashElement(dirPath, options).then(result => result.hash);
}
exports.getHashForResourceDir = getHashForResourceDir;
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function filterResources(resources, filteredResources) {
  if (!filteredResources) {
    return resources;
  }
  resources = resources.filter(resource => {
    let common = false;
    for (let i = 0; i < filteredResources.length; ++i) {
      if (filteredResources[i].category === resource.category && filteredResources[i].resourceName === resource.resourceName) {
        common = true;
        break;
      }
    }
    return common;
  });
  return resources;
}
function getAllResources(amplifyMeta, category, resourceName, filteredResources) {
  let resources = [];
  Object.keys(amplifyMeta).forEach(categoryName => {
    const categoryItem = amplifyMeta[categoryName];
    Object.keys(categoryItem).forEach(resource => {
      amplifyMeta[categoryName][resource].resourceName = resource;
      amplifyMeta[categoryName][resource].category = categoryName;
      resources.push(amplifyMeta[categoryName][resource]);
    });
  });
  resources = filterResources(resources, filteredResources);
  if (category !== undefined && resourceName !== undefined) {
    resources = resources.filter(resource => resource.category === category && resource.resourceName === resourceName);
  }
  if (category !== undefined && !resourceName) {
    resources = resources.filter(resource => resource.category === category);
  }
  return resources;
}
function getResourcesToBeCreated(amplifyMeta, currentAmplifyMeta, category, resourceName, filteredResources) {
  let resources = [];
  Object.keys(amplifyMeta).forEach(categoryName => {
    const categoryItem = amplifyMeta[categoryName];
    Object.keys(categoryItem).forEach(resource => {
      if (
        (!amplifyMeta[categoryName][resource].lastPushTimeStamp ||
          !currentAmplifyMeta[categoryName] ||
          !currentAmplifyMeta[categoryName][resource]) &&
        categoryName !== 'providers' &&
        amplifyMeta[categoryName][resource].serviceType !== 'imported'
      ) {
        amplifyMeta[categoryName][resource].resourceName = resource;
        amplifyMeta[categoryName][resource].category = categoryName;
        resources.push(amplifyMeta[categoryName][resource]);
      }
    });
  });
  resources = filterResources(resources, filteredResources);
  if (category !== undefined && resourceName !== undefined) {
    resources = resources.filter(resource => resource.category === category && resource.resourceName === resourceName);
  }
  if (category !== undefined && !resourceName) {
    resources = resources.filter(resource => resource.category === category);
  }
  for (let i = 0; i < resources.length; ++i) {
    if (resources[i].dependsOn && resources[i].dependsOn.length > 0) {
      for (let j = 0; j < resources[i].dependsOn.length; ++j) {
        const dependsOnCategory = resources[i].dependsOn[j].category;
        const dependsOnResourcename = resources[i].dependsOn[j].resourceName;
        if (
          amplifyMeta[dependsOnCategory] &&
          (!amplifyMeta[dependsOnCategory][dependsOnResourcename].lastPushTimeStamp ||
            !currentAmplifyMeta[dependsOnCategory] ||
            !currentAmplifyMeta[dependsOnCategory][dependsOnResourcename]) &&
          amplifyMeta[dependsOnCategory][dependsOnResourcename].serviceType !== 'imported'
        ) {
          resources.push(amplifyMeta[dependsOnCategory][dependsOnResourcename]);
        }
      }
    }
  }
  return lodash_1.default.uniqWith(resources, lodash_1.default.isEqual);
}
function getResourcesToBeDeleted(amplifyMeta, currentAmplifyMeta, category, resourceName, filteredResources) {
  let resources = [];
  Object.keys(currentAmplifyMeta).forEach(categoryName => {
    const categoryItem = currentAmplifyMeta[categoryName];
    Object.keys(categoryItem).forEach(resource => {
      if ((!amplifyMeta[categoryName] || !amplifyMeta[categoryName][resource]) && categoryItem[resource].serviceType !== 'imported') {
        currentAmplifyMeta[categoryName][resource].resourceName = resource;
        currentAmplifyMeta[categoryName][resource].category = categoryName;
        resources.push(currentAmplifyMeta[categoryName][resource]);
      }
    });
  });
  resources = filterResources(resources, filteredResources);
  if (category !== undefined && resourceName !== undefined) {
    resources = resources.filter(resource => resource.category === category && resource.resourceName === resourceName);
  }
  if (category !== undefined && !resourceName) {
    resources = resources.filter(resource => resource.category === category);
  }
  return resources;
}
async function getResourcesToBeUpdated(amplifyMeta, currentAmplifyMeta, category, resourceName, filteredResources) {
  let resources = [];
  await asyncForEach(Object.keys(amplifyMeta), async categoryName => {
    const categoryItem = amplifyMeta[categoryName];
    await asyncForEach(Object.keys(categoryItem), async resource => {
      if (categoryName === 'analytics') {
        remove_pinpoint_policy_1.removeGetUserEndpoints(resource);
      }
      if (
        currentAmplifyMeta[categoryName] &&
        currentAmplifyMeta[categoryName][resource] !== undefined &&
        amplifyMeta[categoryName] &&
        amplifyMeta[categoryName][resource] !== undefined &&
        amplifyMeta[categoryName][resource].serviceType !== 'imported'
      ) {
        const isLambdaLayer = amplifyMeta[categoryName][resource].service === 'LambdaLayer';
        const backendModified = await isBackendDirModifiedSinceLastPush(
          resource,
          categoryName,
          currentAmplifyMeta[categoryName][resource].lastPushTimeStamp,
          isLambdaLayer,
        );
        if (backendModified) {
          amplifyMeta[categoryName][resource].resourceName = resource;
          amplifyMeta[categoryName][resource].category = categoryName;
          resources.push(amplifyMeta[categoryName][resource]);
        }
        if (categoryName === 'hosting' && currentAmplifyMeta[categoryName][resource].service === 'ElasticContainer') {
          const {
            frontend,
            [frontend]: {
              config: { SourceDir },
            },
          } = amplify_cli_core_1.stateManager.getProjectConfig();
          const projectRootPath = amplify_cli_core_1.pathManager.findProjectRoot();
          if (projectRootPath) {
            const sourceAbsolutePath = path.join(projectRootPath, SourceDir);
            const dockerfileHash = await getHashForResourceDir(sourceAbsolutePath, [
              'Dockerfile',
              'docker-compose.yaml',
              'docker-compose.yml',
            ]);
            if (currentAmplifyMeta[categoryName][resource]['lastPushDirHash'] !== dockerfileHash) {
              resources.push(amplifyMeta[categoryName][resource]);
              return;
            }
          }
        }
      }
    });
  });
  resources = filterResources(resources, filteredResources);
  if (category !== undefined && resourceName !== undefined) {
    resources = resources.filter(resource => resource.category === category && resource.resourceName === resourceName);
  }
  if (category !== undefined && !resourceName) {
    resources = resources.filter(resource => resource.category === category);
  }
  return resources;
}
function getResourcesToBeSynced(amplifyMeta, currentAmplifyMeta, category, resourceName, filteredResources) {
  let resources = [];
  Object.keys(amplifyMeta).forEach(categoryName => {
    const categoryItem = amplifyMeta[categoryName];
    Object.keys(categoryItem)
      .filter(resource => categoryItem[resource].serviceType === 'imported')
      .forEach(resource => {
        if (
          lodash_1.default.get(currentAmplifyMeta, [categoryName, resource], undefined) === undefined &&
          lodash_1.default.get(amplifyMeta, [categoryName, resource], undefined) !== undefined
        ) {
          amplifyMeta[categoryName][resource].resourceName = resource;
          amplifyMeta[categoryName][resource].category = categoryName;
          amplifyMeta[categoryName][resource].sync = 'import';
          resources.push(amplifyMeta[categoryName][resource]);
        } else if (
          lodash_1.default.get(currentAmplifyMeta, [categoryName, resource], undefined) !== undefined &&
          lodash_1.default.get(amplifyMeta, [categoryName, resource], undefined) === undefined
        ) {
          amplifyMeta[categoryName][resource].resourceName = resource;
          amplifyMeta[categoryName][resource].category = categoryName;
          amplifyMeta[categoryName][resource].sync = 'unlink';
          resources.push(amplifyMeta[categoryName][resource]);
        } else if (
          lodash_1.default.get(currentAmplifyMeta, [categoryName, resource], undefined) !== undefined &&
          lodash_1.default.get(amplifyMeta, [categoryName, resource], undefined) !== undefined
        ) {
          amplifyMeta[categoryName][resource].resourceName = resource;
          amplifyMeta[categoryName][resource].category = categoryName;
          amplifyMeta[categoryName][resource].sync = 'refresh';
          resources.push(amplifyMeta[categoryName][resource]);
        }
      });
  });
  Object.keys(currentAmplifyMeta).forEach(categoryName => {
    const categoryItem = currentAmplifyMeta[categoryName];
    Object.keys(categoryItem)
      .filter(resource => categoryItem[resource].serviceType === 'imported')
      .forEach(resource => {
        if (
          lodash_1.default.get(currentAmplifyMeta, [categoryName, resource], undefined) !== undefined &&
          lodash_1.default.get(amplifyMeta, [categoryName, resource], undefined) === undefined
        ) {
          currentAmplifyMeta[categoryName][resource].resourceName = resource;
          currentAmplifyMeta[categoryName][resource].category = categoryName;
          currentAmplifyMeta[categoryName][resource].sync = 'unlink';
          resources.push(currentAmplifyMeta[categoryName][resource]);
        }
      });
  });
  resources = filterResources(resources, filteredResources);
  if (category !== undefined && resourceName !== undefined) {
    resources = resources.filter(resource => resource.category === category && resource.resourceName === resourceName);
  }
  if (category !== undefined && !resourceName) {
    resources = resources.filter(resource => resource.category === category);
  }
  return resources;
}
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; ++index) {
    await callback(array[index], index, array);
  }
}
async function getResourceStatus(category, resourceName, providerName, filteredResources) {
  const amplifyProjectInitStatus = get_cloud_init_status_1.getCloudInitStatus();
  let amplifyMeta;
  let currentAmplifyMeta = {};
  if (amplifyProjectInitStatus === get_cloud_init_status_1.CLOUD_INITIALIZED) {
    amplifyMeta = amplify_cli_core_1.stateManager.getMeta();
    currentAmplifyMeta = amplify_cli_core_1.stateManager.getCurrentMeta();
  } else if (amplifyProjectInitStatus === get_cloud_init_status_1.CLOUD_NOT_INITIALIZED) {
    amplifyMeta = amplify_cli_core_1.stateManager.getBackendConfig();
  } else {
    throw new amplify_cli_core_1.NotInitializedError();
  }
  let resourcesToBeCreated = getResourcesToBeCreated(amplifyMeta, currentAmplifyMeta, category, resourceName, filteredResources);
  let resourcesToBeUpdated = await getResourcesToBeUpdated(amplifyMeta, currentAmplifyMeta, category, resourceName, filteredResources);
  let resourcesToBeSynced = getResourcesToBeSynced(amplifyMeta, currentAmplifyMeta, category, resourceName, filteredResources);
  let resourcesToBeDeleted = getResourcesToBeDeleted(amplifyMeta, currentAmplifyMeta, category, resourceName, filteredResources);
  let allResources = getAllResources(amplifyMeta, category, resourceName, filteredResources);
  resourcesToBeCreated = resourcesToBeCreated.filter(resource => resource.category !== 'provider');
  if (providerName) {
    resourcesToBeCreated = resourcesToBeCreated.filter(resource => resource.providerPlugin === providerName);
    resourcesToBeUpdated = resourcesToBeUpdated.filter(resource => resource.providerPlugin === providerName);
    resourcesToBeSynced = resourcesToBeSynced.filter(resource => resource.providerPlugin === providerName);
    resourcesToBeDeleted = resourcesToBeDeleted.filter(resource => resource.providerPlugin === providerName);
    allResources = allResources.filter(resource => resource.providerPlugin === providerName);
  }
  const tagsUpdated = !lodash_1.default.isEqual(
    amplify_cli_core_1.stateManager.getProjectTags(),
    amplify_cli_core_1.stateManager.getCurrentProjectTags(),
  );
  return {
    resourcesToBeCreated,
    resourcesToBeUpdated,
    resourcesToBeSynced,
    resourcesToBeDeleted,
    tagsUpdated,
    allResources,
  };
}
exports.getResourceStatus = getResourceStatus;
async function showResourceTable(category, resourceName, filteredResources) {
  const amplifyProjectInitStatus = get_cloud_init_status_1.getCloudInitStatus();
  if (amplifyProjectInitStatus === get_cloud_init_status_1.CLOUD_INITIALIZED) {
    const { envName } = get_env_info_1.getEnvInfo();
    print_1.print.info('');
    print_1.print.info(`${chalk_1.default.green('Current Environment')}: ${envName}`);
    print_1.print.info('');
  }
  const {
    resourcesToBeCreated,
    resourcesToBeUpdated,
    resourcesToBeDeleted,
    resourcesToBeSynced,
    allResources,
    tagsUpdated,
  } = await getResourceStatus(category, resourceName, undefined, filteredResources);
  let noChangeResources = lodash_1.default.differenceWith(
    allResources,
    resourcesToBeCreated.concat(resourcesToBeUpdated).concat(resourcesToBeSynced),
    lodash_1.default.isEqual,
  );
  noChangeResources = noChangeResources.filter(resource => resource.category !== 'providers');
  const createOperationLabel = 'Create';
  const updateOperationLabel = 'Update';
  const deleteOperationLabel = 'Delete';
  const importOperationLabel = 'Import';
  const unlinkOperationLabel = 'Unlink';
  const noOperationLabel = 'No Change';
  const tableOptions = [['Category', 'Resource name', 'Operation', 'Provider plugin']];
  for (let i = 0; i < resourcesToBeCreated.length; ++i) {
    tableOptions.push([
      capitalize(resourcesToBeCreated[i].category),
      resourcesToBeCreated[i].resourceName,
      createOperationLabel,
      resourcesToBeCreated[i].providerPlugin,
    ]);
  }
  for (let i = 0; i < resourcesToBeUpdated.length; ++i) {
    tableOptions.push([
      capitalize(resourcesToBeUpdated[i].category),
      resourcesToBeUpdated[i].resourceName,
      updateOperationLabel,
      resourcesToBeUpdated[i].providerPlugin,
    ]);
  }
  for (let i = 0; i < resourcesToBeSynced.length; ++i) {
    let operation;
    switch (resourcesToBeSynced[i].sync) {
      case 'import':
        operation = importOperationLabel;
        break;
      case 'unlink':
        operation = unlinkOperationLabel;
        break;
      default:
        operation = noOperationLabel;
        break;
    }
    tableOptions.push([
      capitalize(resourcesToBeSynced[i].category),
      resourcesToBeSynced[i].resourceName,
      operation,
      resourcesToBeSynced[i].providerPlugin,
    ]);
  }
  for (let i = 0; i < resourcesToBeDeleted.length; ++i) {
    tableOptions.push([
      capitalize(resourcesToBeDeleted[i].category),
      resourcesToBeDeleted[i].resourceName,
      deleteOperationLabel,
      resourcesToBeDeleted[i].providerPlugin,
    ]);
  }
  for (let i = 0; i < noChangeResources.length; ++i) {
    tableOptions.push([
      capitalize(noChangeResources[i].category),
      noChangeResources[i].resourceName,
      noOperationLabel,
      noChangeResources[i].providerPlugin,
    ]);
  }
  const { table } = print_1.print;
  table(tableOptions, { format: 'markdown' });
  if (tagsUpdated) {
    print_1.print.info('\nTag Changes Detected');
  }
  const resourceChanged =
    resourcesToBeCreated.length + resourcesToBeUpdated.length + resourcesToBeSynced.length + resourcesToBeDeleted.length > 0 || tagsUpdated;
  return resourceChanged;
}
exports.showResourceTable = showResourceTable;
//# sourceMappingURL=resource-status.js.map
