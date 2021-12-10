export declare class Input {
  argv: Array<string>;
  plugin?: string;
  command?: string;
  subCommands?: string[];
  options?: {
    [key: string]: string | boolean;
  };
  constructor(argv: Array<string>);
}
//# sourceMappingURL=input.d.ts.map
