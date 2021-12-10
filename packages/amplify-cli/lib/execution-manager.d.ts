import { Context } from './domain/context';
import { AmplifyEventArgs } from './domain/amplify-event';
export declare function executeCommand(context: Context): Promise<void>;
export declare function isContainersEnabled(context: any): any;
export declare function raiseEvent(context: Context, args: AmplifyEventArgs): Promise<void>;
//# sourceMappingURL=execution-manager.d.ts.map
