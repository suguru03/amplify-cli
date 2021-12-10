import { Input } from '../input';
export declare class UsageDataPayload {
  sessionUuid: string;
  installationUuid: string;
  amplifyCliVersion: string;
  input: Input | null;
  inputOptions: InputOptions;
  timestamp: string;
  error: SerializableError;
  payloadVersion: string;
  osPlatform: string;
  osRelease: string;
  nodeVersion: string;
  state: string;
  isCi: boolean;
  accountId: string;
  projectSetting: ProjectSettings;
  constructor(
    sessionUuid: string,
    installationUuid: string,
    version: string,
    input: Input,
    error: Error | null,
    state: string,
    accountId: string,
    project: ProjectSettings,
    inputOptions: InputOptions,
  );
}
export declare type ProjectSettings = {
  frontend?: string;
  editor?: string;
  framework?: string;
};
export declare type InputOptions = Record<string, string | boolean>;
export declare class SerializableError {
  name: string;
  constructor(error: Error);
}
//# sourceMappingURL=UsageDataPayload.d.ts.map
