import { $TSContext } from 'amplify-cli-core';
export declare function forceRemoveResource(context: $TSContext, category: any, name: any, dir: any): Promise<any>;
export declare function removeResource(
  context: $TSContext,
  category: any,
  resourceName: any,
  questionOptions?: {
    serviceSuffix?: any;
    serviceDeletionInfo?: [];
  },
): Promise<
  | {
      service: any;
      resourceName: any;
    }
  | undefined
>;
//# sourceMappingURL=remove-resource.d.ts.map
