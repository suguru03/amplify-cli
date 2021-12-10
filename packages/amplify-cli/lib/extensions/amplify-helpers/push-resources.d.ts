import { $TSContext } from 'amplify-cli-core';
export declare function pushResources(
  context: $TSContext,
  category?: string,
  resourceName?: string,
  filteredResources?: {
    category: string;
    resourceName: string;
  }[],
): Promise<any>;
export declare function storeCurrentCloudBackend(context: $TSContext): Promise<void>;
//# sourceMappingURL=push-resources.d.ts.map
