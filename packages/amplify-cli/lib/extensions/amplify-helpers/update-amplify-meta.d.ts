import { $TSAny, $TSMeta, $TSObject, ResourceTuple } from 'amplify-cli-core';
import { BuildType } from 'amplify-function-plugin-interface';
export declare function updateAwsMetaFile(
  filePath: string,
  category: string,
  resourceName: string,
  attribute: $TSAny,
  value: $TSAny,
  timestamp: $TSAny,
): $TSMeta;
export declare function updateamplifyMetaAfterResourceAdd(
  category: string,
  resourceName: string,
  metadataResource?: {
    dependsOn?: any;
  },
  backendConfigResource?: {
    dependsOn?: any;
  },
  overwriteObjectIfExists?: boolean,
): void;
export declare function updateProvideramplifyMeta(providerName: string, options: $TSObject): void;
export declare function updateamplifyMetaAfterResourceUpdate(
  category: string,
  resourceName: string,
  attribute: string,
  value: $TSAny,
): $TSMeta;
export declare function updateamplifyMetaAfterPush(resources: $TSObject[]): Promise<void>;
export declare function updateamplifyMetaAfterBuild({ category, resourceName }: ResourceTuple, buildType?: BuildType): void;
export declare function updateAmplifyMetaAfterPackage({ category, resourceName }: ResourceTuple, zipFilename: string): void;
export declare function updateamplifyMetaAfterResourceDelete(category: string, resourceName: string): void;
//# sourceMappingURL=update-amplify-meta.d.ts.map
