/// <reference types="node" />
import { Input } from '../input';
import { UrlWithStringQuery } from 'url';
import { ProjectSettings, UsageDataPayload, InputOptions } from './UsageDataPayload';
import { IUsageData } from './IUsageData';
export declare class UsageData implements IUsageData {
  sessionUuid: string;
  accountId: string;
  installationUuid: string;
  version: string;
  input: Input;
  projectSettings: ProjectSettings;
  url: UrlWithStringQuery;
  inputOptions: InputOptions;
  requestTimeout: number;
  private static instance;
  private constructor();
  init(installationUuid: string, version: string, input: Input, accountId: string, projectSettings: ProjectSettings): void;
  static get Instance(): IUsageData;
  emitError(error: Error | null): Promise<void>;
  emitInvoke(): Promise<void>;
  emitAbort(): Promise<void>;
  emitSuccess(): Promise<void>;
  emit(error: Error | null, state: string): Promise<void>;
  send(payload: UsageDataPayload): Promise<void>;
}
//# sourceMappingURL=UsageData.d.ts.map
