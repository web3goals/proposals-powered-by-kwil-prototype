export interface SchemaObj {
  owner: string;
  name: string;
  tables: object[];
  actions: object[];
  extensions: Extensions[];
}

export interface Extensions {
  name: string;
  config: MathConfig;
  alias: string;
}

export interface MathConfig {
  round: string;
}

export interface RecordTable {
  id: string;
  operationtype: string;
  param1: number;
  param2: number;
  finalresponse: number;
}
