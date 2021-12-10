import { Context } from './domain/context';
export declare function attachExtentions(context: Context): void;
declare const print: {
  info: typeof info;
  fancy: typeof fancy;
  warning: typeof warning;
  error: typeof error;
  success: typeof success;
  table: typeof table;
  debug: typeof debug;
  green: typeof green;
  yellow: typeof yellow;
  red: typeof red;
  blue: typeof blue;
};
export { print };
declare function info(message: string): void;
declare function warning(message: string): void;
declare function error(message: string): void;
declare function success(message: string): void;
declare function green(message: string): void;
declare function yellow(message: string): void;
declare function red(message: string): void;
declare function blue(message: string): void;
declare function fancy(message?: string): void;
declare function debug(message: string, title?: string): void;
declare function table(
  data: string[][],
  options?: {
    format?: 'markdown' | 'lean';
  },
): void;
//# sourceMappingURL=context-extensions.d.ts.map
