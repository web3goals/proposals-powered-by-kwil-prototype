export interface SchemaObj {
  owner: string;
  name: string;
  tables: object[];
  actions: object[];
  extensions: Extension[];
}

export interface Extension {
  name: string;
  config: ExtensionConfig;
  alias: string;
}

export interface ExtensionConfig {
  round?: string;
  chain?: string;
}
