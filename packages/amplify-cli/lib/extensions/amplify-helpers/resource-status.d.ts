export declare function getHashForResourceDir(dirPath: any, files?: string[]): Promise<string>;
export declare function getResourceStatus(
  category?: any,
  resourceName?: any,
  providerName?: any,
  filteredResources?: any,
): Promise<{
  resourcesToBeCreated: any;
  resourcesToBeUpdated: any;
  resourcesToBeSynced: any;
  resourcesToBeDeleted: any;
  tagsUpdated: boolean;
  allResources: any;
}>;
export declare function showResourceTable(category: any, resourceName: any, filteredResources: any): Promise<boolean>;
//# sourceMappingURL=resource-status.d.ts.map
