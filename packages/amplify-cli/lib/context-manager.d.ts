import { Context } from './domain/context';
import { Input } from './domain/input';
import { PluginPlatform } from './domain/plugin-platform';
export declare function constructContext(pluginPlatform: PluginPlatform, input: Input): Context;
export declare function attachUsageData(context: Context): Promise<void>;
export declare function persistContext(context: Context): void;
//# sourceMappingURL=context-manager.d.ts.map
