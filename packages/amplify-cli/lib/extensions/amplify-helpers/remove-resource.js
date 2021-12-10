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
exports.removeResource = exports.forceRemoveResource = void 0;
const path = __importStar(require('path'));
const inquirer = __importStar(require('inquirer'));
const lodash_1 = __importDefault(require('lodash'));
const amplify_cli_core_1 = require('amplify-cli-core');
const update_backend_config_1 = require('./update-backend-config');
const envResourceParams_1 = require('./envResourceParams');
async function forceRemoveResource(context, category, name, dir) {
  const amplifyMeta = amplify_cli_core_1.stateManager.getMeta();
  if (!amplifyMeta[category] || Object.keys(amplifyMeta[category]).length === 0) {
    context.print.error('No resources added for this category');
    await context.usageData.emitError(new amplify_cli_core_1.ResourceDoesNotExistError());
    amplify_cli_core_1.exitOnNextTick(1);
  }
  if (!context || !category || !name || !dir) {
    context.print.error('Unable to force removal of resource: missing parameters');
    await context.usageData.emitError(new amplify_cli_core_1.MissingParametersError());
    amplify_cli_core_1.exitOnNextTick(1);
  }
  context.print.info(`Removing resource ${name}...`);
  let response;
  try {
    response = await deleteResourceFiles(context, category, name, dir, true);
  } catch (e) {
    context.print.error('Unable to force removal of resource: error deleting files');
  }
  return response;
}
exports.forceRemoveResource = forceRemoveResource;
async function removeResource(context, category, resourceName, questionOptions = {}) {
  const amplifyMeta = amplify_cli_core_1.stateManager.getMeta();
  if (
    !amplifyMeta[category] ||
    Object.keys(amplifyMeta[category]).filter(r => amplifyMeta[category][r].mobileHubMigrated !== true).length === 0
  ) {
    context.print.error('No resources added for this category');
    await context.usageData.emitError(new amplify_cli_core_1.ResourceDoesNotExistError());
    amplify_cli_core_1.exitOnNextTick(1);
  }
  let enabledCategoryResources = Object.keys(amplifyMeta[category]).filter(r => amplifyMeta[category][r].mobileHubMigrated !== true);
  if (resourceName) {
    if (!enabledCategoryResources.includes(resourceName)) {
      const errMessage = `Resource ${resourceName} has not been added to ${category}`;
      context.print.error(errMessage);
      await context.usageData.emitError(new amplify_cli_core_1.ResourceDoesNotExistError(errMessage));
      amplify_cli_core_1.exitOnNextTick(1);
    }
  } else {
    if (questionOptions.serviceSuffix) {
      enabledCategoryResources = enabledCategoryResources.map(resource => {
        let service = lodash_1.default.get(amplifyMeta, [category, resource, 'service']);
        let suffix = lodash_1.default.get(questionOptions, ['serviceSuffix', service], '');
        return { name: `${resource} ${suffix}`, value: resource };
      });
    }
    const question = [
      {
        name: 'resource',
        message: 'Choose the resource you would want to remove',
        type: 'list',
        choices: enabledCategoryResources,
      },
    ];
    const answer = await inquirer.prompt(question);
    resourceName = answer.resource;
  }
  context.print.info('');
  const service = lodash_1.default.get(amplifyMeta, [category, resourceName, 'service']);
  const serviceType = lodash_1.default.get(amplifyMeta, [category, resourceName, 'serviceType']);
  if (lodash_1.default.has(questionOptions, ['serviceDeletionInfo', service])) {
    context.print.info(questionOptions.serviceDeletionInfo[service]);
  }
  const resourceDir = path.normalize(path.join(amplify_cli_core_1.pathManager.getBackendDirPath(), category, resourceName));
  let promptText =
    'Are you sure you want to delete the resource? This action deletes all files related to this resource from the backend directory.';
  if (serviceType === 'imported') {
    promptText =
      'Are you sure you want to unlink this imported resource from this Amplify backend environment? The imported resource itself will not be deleted.';
  }
  const confirm = (context.input.options && context.input.options.yes) || (await context.amplify.confirmPrompt(promptText));
  if (!confirm) {
    return;
  }
  try {
    return deleteResourceFiles(context, category, resourceName, resourceDir);
  } catch (err) {
    context.print.info(err.stack);
    context.print.error('An error occurred when removing the resources from the local directory');
    context.usageData.emitError(err);
    process.exitCode = 1;
  }
}
exports.removeResource = removeResource;
const deleteResourceFiles = async (context, category, resourceName, resourceDir, force) => {
  const amplifyMeta = amplify_cli_core_1.stateManager.getMeta();
  if (!force) {
    const { allResources } = await context.amplify.getResourceStatus();
    allResources.forEach(resourceItem => {
      if (resourceItem.dependsOn) {
        resourceItem.dependsOn.forEach(dependsOnItem => {
          if (dependsOnItem.category === category && dependsOnItem.resourceName === resourceName) {
            context.print.error('Resource cannot be removed because it has a dependency on another resource');
            context.print.error(`Dependency: ${resourceItem.service}:${resourceItem.resourceName}`);
            throw new Error('Resource cannot be removed because it has a dependency on another resource');
          }
        });
      }
    });
  }
  const resourceValues = {
    service: amplifyMeta[category][resourceName].service,
    resourceName,
  };
  if (amplifyMeta[category][resourceName] !== undefined) {
    delete amplifyMeta[category][resourceName];
  }
  amplify_cli_core_1.stateManager.setMeta(undefined, amplifyMeta);
  context.filesystem.remove(resourceDir);
  envResourceParams_1.removeResourceParameters(context, category, resourceName);
  update_backend_config_1.updateBackendConfigAfterResourceRemove(category, resourceName);
  context.print.success('Successfully removed resource');
  return resourceValues;
};
//# sourceMappingURL=remove-resource.js.map
