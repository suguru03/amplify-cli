import { Input } from './input';
import { AmplifyToolkit } from './amplify-toolkit';
import { PluginPlatform } from './plugin-platform';
import { IUsageData } from './amplify-usageData';
export declare class Context {
  pluginPlatform: PluginPlatform;
  input: Input;
  amplify: AmplifyToolkit;
  usageData: IUsageData;
  constructor(pluginPlatform: PluginPlatform, input: Input);
  [key: string]: any;
}
//# sourceMappingURL=context.d.ts.map
