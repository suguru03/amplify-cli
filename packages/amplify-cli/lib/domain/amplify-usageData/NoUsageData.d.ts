import { IUsageData } from './IUsageData';
export declare class NoUsageData implements IUsageData {
  emitError(error: Error): Promise<void>;
  emitInvoke(): Promise<void>;
  emitAbort(): Promise<void>;
  emitSuccess(): Promise<void>;
  init(installationUuid: string, version: String, input: any, accountId: string): void;
  private static instance;
  static get Instance(): IUsageData;
}
//# sourceMappingURL=NoUsageData.d.ts.map
