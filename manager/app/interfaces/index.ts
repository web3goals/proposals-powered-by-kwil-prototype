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

export interface RecordTable {
  id: string;
  operationtype: string;
  param1: number;
  param2: number;
  finalresponse: number;
}
