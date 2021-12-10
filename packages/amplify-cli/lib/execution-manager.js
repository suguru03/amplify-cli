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
exports.raiseEvent = exports.isContainersEnabled = exports.executeCommand = void 0;
const fs = __importStar(require('fs-extra'));
const path = __importStar(require('path'));
const inquirer = __importStar(require('inquirer'));
const amplify_cli_core_1 = require('amplify-cli-core');
const set_ops_1 = require('./utils/set-ops');
const constants_1 = require('./domain/constants');
const plugin_manager_1 = require('./plugin-manager');
const amplify_event_1 = require('./domain/amplify-event');
const headless_input_utils_1 = require('./utils/headless-input-utils');
async function executeCommand(context) {
  const pluginCandidates = plugin_manager_1.getPluginsWithNameAndCommand(
    context.pluginPlatform,
    context.input.plugin,
    context.input.command,
  );
  if (pluginCandidates.length === 1) {
    await executePluginModuleCommand(context, pluginCandidates[0]);
  } else if (pluginCandidates.length > 1) {
    const selectedPluginInfo = await selectPluginForExecution(context, pluginCandidates);
    await executePluginModuleCommand(context, selectedPluginInfo);
  }
}
exports.executeCommand = executeCommand;
function isContainersEnabled(context) {
  var _a, _b, _c;
  const projectConfig = context.amplify.getProjectConfig();
  return (_c =
    (_b =
      (_a = projectConfig === null || projectConfig === void 0 ? void 0 : projectConfig[projectConfig.frontend]) === null || _a === void 0
        ? void 0
        : _a.config) === null || _b === void 0
      ? void 0
      : _b.ServerlessContainers) !== null && _c !== void 0
    ? _c
    : false;
}
exports.isContainersEnabled = isContainersEnabled;
async function selectPluginForExecution(context, pluginCandidates) {
  let result = pluginCandidates[0];
  let promptForSelection = true;
  const noSmartPickCommands = ['add', 'help'];
  const commandAllowsSmartPick = !noSmartPickCommands.includes(context.input.command);
  if (commandAllowsSmartPick) {
    let candidatesAreAllCategoryPlugins = pluginCandidates.every(pluginInfo => {
      return pluginInfo.manifest.type === 'category';
    });
    const pluginName = pluginCandidates[0].manifest.name;
    let candidatesAllHaveTheSameName = pluginCandidates.every(pluginInfo => {
      return pluginInfo.manifest.name === pluginName;
    });
    if (candidatesAreAllCategoryPlugins && candidatesAllHaveTheSameName) {
      if (amplify_cli_core_1.stateManager.metaFileExists()) {
        const amplifyMeta = amplify_cli_core_1.stateManager.getMeta();
        const servicesSetInMeta = new Set(Object.keys(amplifyMeta[pluginName] || {}));
        const pluginWithMatchingServices = [];
        const pluginWithDisjointServices = [];
        const pluginWithoutServicesDeclared = [];
        let i = 0;
        while (i < pluginCandidates.length) {
          if (pluginCandidates[i].manifest.services && pluginCandidates[i].manifest.services.length > 0) {
            const servicesSetInPlugin = new Set(pluginCandidates[i].manifest.services);
            if (set_ops_1.twoStringSetsAreEqual(servicesSetInMeta, servicesSetInPlugin)) {
              pluginWithMatchingServices.push(pluginCandidates[i]);
            }
            if (set_ops_1.twoStringSetsAreDisjoint(servicesSetInMeta, servicesSetInPlugin)) {
              pluginWithDisjointServices.push(pluginCandidates[i]);
            }
          } else {
            pluginWithDisjointServices.push(pluginCandidates[i]);
            pluginWithoutServicesDeclared.push(pluginCandidates[i]);
          }
          i++;
        }
        if (pluginWithMatchingServices.length === 1 && pluginWithDisjointServices.length === pluginCandidates.length - 1) {
          result = pluginWithMatchingServices[0];
          promptForSelection = false;
        } else if (pluginWithDisjointServices.length === pluginCandidates.length && pluginWithoutServicesDeclared.length === 1) {
          result = pluginWithoutServicesDeclared[0];
          promptForSelection = false;
        }
      }
    }
  }
  if (promptForSelection) {
    let noDuplicateDisplayNames = true;
    let displayNameSet = new Set();
    let i = 0;
    while (noDuplicateDisplayNames && i < pluginCandidates.length) {
      const { displayName } = pluginCandidates[i].manifest;
      if (displayName) {
        if (displayNameSet.has(displayName)) {
          noDuplicateDisplayNames = false;
          break;
        } else {
          displayNameSet.add(displayName);
        }
      }
      i++;
    }
    const consoleHostingPlugins = pluginCandidates.filter(pluginInfo => {
      return pluginInfo.packageName === 'amplify-console-hosting';
    });
    if (consoleHostingPlugins.length > 0) {
      const otherPlugins = pluginCandidates.filter(pluginInfo => {
        return pluginInfo.packageName !== 'amplify-console-hosting';
      });
      pluginCandidates = consoleHostingPlugins.concat(otherPlugins);
    }
    const amplifyMeta = context.amplify.getProjectMeta();
    const { Region } = amplifyMeta.providers['awscloudformation'];
    if (!isContainersEnabled(context) || Region !== 'us-east-1') {
      pluginCandidates = pluginCandidates.filter(plugin => {
        var _a;
        return !((_a = plugin.manifest.services) === null || _a === void 0 ? void 0 : _a.includes('ElasticContainer'));
      });
    }
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'section',
      message: 'Select the plugin module to execute',
      choices: pluginCandidates.map(plugin => {
        let displayName = plugin.packageName + '@' + plugin.packageVersion;
        if (plugin.manifest.displayName && noDuplicateDisplayNames) {
          displayName = plugin.manifest.displayName;
        }
        const pluginOption = {
          name: displayName,
          value: plugin,
          short: displayName,
        };
        return pluginOption;
      }),
    });
    result = answer.section;
  }
  return result;
}
async function executePluginModuleCommand(context, plugin) {
  const { commands, commandAliases } = plugin.manifest;
  if (!commands.includes(context.input.command)) {
    context.input.command = commandAliases[context.input.command];
  }
  if (!fs.existsSync(plugin.packageLocation)) {
    await plugin_manager_1.scan();
    context.print.error('The Amplify CLI plugin platform detected an error.');
    context.print.info('It has performed a fresh scan.');
    context.print.info('Please execute your command again.');
    return;
  }
  const handler = await getHandler(plugin, context);
  attachContextExtensions(context, plugin);
  await raisePreEvent(context);
  await handler();
  await raisePostEvent(context);
}
const getHandler = async (pluginInfo, context) => {
  const pluginModule = await Promise.resolve().then(() => __importStar(require(pluginInfo.packageLocation)));
  let commandName = constants_1.constants.ExecuteAmplifyCommand;
  let fallbackFn = () => legacyCommandExecutor(context, pluginInfo);
  if (headless_input_utils_1.isHeadlessCommand(context)) {
    commandName = constants_1.constants.ExecuteAmplifyHeadlessCommand;
    fallbackFn = () => context.print.error(`Headless mode is not implemented for ${pluginInfo.packageName}`);
  }
  if (pluginModule.hasOwnProperty(commandName) && typeof pluginModule[commandName] === 'function') {
    if (commandName === constants_1.constants.ExecuteAmplifyHeadlessCommand) {
      return async () => pluginModule[commandName](context, await headless_input_utils_1.readHeadlessPayload());
    } else {
      return () => pluginModule[commandName](context);
    }
  } else {
    return fallbackFn;
  }
};
const legacyCommandExecutor = async (context, plugin) => {
  let commandFilepath = path.normalize(path.join(plugin.packageLocation, 'commands', plugin.manifest.name, context.input.command));
  if (context.input.subCommands && context.input.subCommands.length > 0) {
    commandFilepath = path.join(commandFilepath, ...context.input.subCommands);
  }
  let commandModule;
  try {
    commandModule = require(commandFilepath);
  } catch (e) {}
  if (!commandModule) {
    commandFilepath = path.normalize(path.join(plugin.packageLocation, 'commands', plugin.manifest.name));
    try {
      commandModule = require(commandFilepath);
    } catch (e) {}
  }
  if (commandModule) {
    attachContextExtensions(context, plugin);
    await commandModule.run(context);
  } else {
    const { showAllHelp } = require('./extensions/amplify-helpers/show-all-help');
    showAllHelp(context);
  }
};
const EVENT_EMITTING_PLUGINS = new Set([constants_1.constants.CORE, constants_1.constants.CODEGEN]);
async function raisePreEvent(context) {
  const { command, plugin } = context.input;
  if (!plugin || !EVENT_EMITTING_PLUGINS.has(plugin)) {
    return;
  }
  switch (command) {
    case 'init':
      await raisePreInitEvent(context);
      break;
    case 'push':
      await raisePrePushEvent(context);
      break;
    case 'pull':
      await raisePrePullEvent(context);
      break;
    case 'models':
      await raisePreCodegenModelsEvent(context);
      break;
  }
}
async function raisePreInitEvent(context) {
  await raiseEvent(
    context,
    new amplify_event_1.AmplifyEventArgs(amplify_event_1.AmplifyEvent.PreInit, new amplify_event_1.AmplifyPreInitEventData()),
  );
}
async function raisePrePushEvent(context) {
  await raiseEvent(
    context,
    new amplify_event_1.AmplifyEventArgs(amplify_event_1.AmplifyEvent.PrePush, new amplify_event_1.AmplifyPrePushEventData()),
  );
}
async function raisePrePullEvent(context) {
  await raiseEvent(
    context,
    new amplify_event_1.AmplifyEventArgs(amplify_event_1.AmplifyEvent.PrePull, new amplify_event_1.AmplifyPrePullEventData()),
  );
}
async function raisePreCodegenModelsEvent(context) {
  await raiseEvent(
    context,
    new amplify_event_1.AmplifyEventArgs(
      amplify_event_1.AmplifyEvent.PreCodegenModels,
      new amplify_event_1.AmplifyPreCodegenModelsEventData(),
    ),
  );
}
async function raisePostEvent(context) {
  const { command, plugin } = context.input;
  if (!plugin || !EVENT_EMITTING_PLUGINS.has(plugin)) {
    return;
  }
  switch (command) {
    case 'init':
      await raisePostInitEvent(context);
      break;
    case 'push':
      await raisePostPushEvent(context);
      break;
    case 'pull':
      await raisePostPullEvent(context);
      break;
    case 'models':
      await raisePostCodegenModelsEvent(context);
      break;
  }
}
async function raisePostInitEvent(context) {
  await raiseEvent(
    context,
    new amplify_event_1.AmplifyEventArgs(amplify_event_1.AmplifyEvent.PostInit, new amplify_event_1.AmplifyPostPushEventData()),
  );
}
async function raisePostPushEvent(context) {
  await raiseEvent(
    context,
    new amplify_event_1.AmplifyEventArgs(amplify_event_1.AmplifyEvent.PostPush, new amplify_event_1.AmplifyPostInitEventData()),
  );
}
async function raisePostPullEvent(context) {
  await raiseEvent(
    context,
    new amplify_event_1.AmplifyEventArgs(amplify_event_1.AmplifyEvent.PostPull, new amplify_event_1.AmplifyPostPullEventData()),
  );
}
async function raisePostCodegenModelsEvent(context) {
  await raiseEvent(
    context,
    new amplify_event_1.AmplifyEventArgs(
      amplify_event_1.AmplifyEvent.PostCodegenModels,
      new amplify_event_1.AmplifyPostCodegenModelsEventData(),
    ),
  );
}
async function raiseEvent(context, args) {
  const plugins = plugin_manager_1.getPluginsWithEventHandler(context.pluginPlatform, args.event);
  if (plugins.length > 0) {
    const sequential = require('promise-sequential');
    const eventHandlers = plugins
      .filter(plugin => {
        const exists = fs.existsSync(plugin.packageLocation);
        return exists;
      })
      .map(plugin => {
        const eventHandler = async () => {
          try {
            attachContextExtensions(context, plugin);
            const pluginModule = require(plugin.packageLocation);
            await pluginModule.handleAmplifyEvent(context, args);
          } catch (_a) {}
        };
        return eventHandler;
      });
    await sequential(eventHandlers);
  }
}
exports.raiseEvent = raiseEvent;
function attachContextExtensions(context, plugin) {
  const extensionsDirPath = path.normalize(path.join(plugin.packageLocation, 'extensions'));
  if (fs.existsSync(extensionsDirPath)) {
    const stats = fs.statSync(extensionsDirPath);
    if (stats.isDirectory()) {
      const itemNames = fs.readdirSync(extensionsDirPath);
      itemNames.forEach(itemName => {
        const itemPath = path.join(extensionsDirPath, itemName);
        let itemModule;
        try {
          itemModule = require(itemPath);
          itemModule(context);
        } catch (e) {}
      });
    }
  }
}
//# sourceMappingURL=execution-manager.js.map
