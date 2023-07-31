import * as dotenv from "dotenv";
import { JsonRpcProvider, Wallet } from "ethers";
import { NodeKwil, Types, Utils } from "kwil";
import { RecordTable, SchemaObj } from "./interfaces";
import mathSchema from "./schemes/math.json";

dotenv.config();

const kwil = new NodeKwil({
  kwilProvider: "http://localhost:8080",
  timeout: 1000,
  logging: false,
});

const provider = new JsonRpcProvider(process.env.RPC_PROVIDER);
const wallet = new Wallet(process.env.PRIVATE_KEY as string, provider);

async function deployDb() {
  console.log("deployDb()");
  let schema: SchemaObj = mathSchema;
  schema.owner = wallet.address;
  const dbTx: Types.Transaction = await kwil
    .dbBuilder()
    .signer(wallet)
    .payload(schema)
    .buildTx();
  const res = await kwil.broadcast(dbTx);
  console.log("res", res);
}

async function readDb() {
  console.log("readDb()");
  const dbid = kwil.getDBID(wallet.address, mathSchema.name);
  const schema = await kwil.getSchema(dbid);
  if (!schema.data) {
    throw new Error("Data is undefined");
  }
  // List the tables in the schema
  console.log("Tables:");
  for (const table of schema.data?.tables) {
    console.log(table.name);
  }
  // List the available actions
  console.log("Actions:");
  for (const action of schema.data.actions) {
    if (action.public) {
      console.log(action.name);
    }
  }
}

async function insertWithAddOperation() {
  console.log("insertWithAddOperation()");
  const input = new Utils.ActionInput()
    .put("$id", "1")
    .put("$v1", "3")
    .put("$v2", "4");
  const tx: Types.Transaction = await kwil
    .actionBuilder()
    .name("addop")
    .dbid(kwil.getDBID(wallet.address, mathSchema.name))
    .signer(wallet)
    .concat(input)
    .buildTx();
  const res = await kwil.broadcast(tx);
  console.log("res", res);
}

async function getValues() {
  console.log("getValues()");
  const res = await kwil.selectQuery(
    kwil.getDBID(wallet.address, mathSchema.name),
    "SELECT * FROM records"
  );
  const results = res.data;
  if (!results) {
    throw new Error("No results returned");
  }
  const record: RecordTable[] = results as RecordTable[];
  console.log(record);
}

async function main() {
  console.log("main()");
  // await deployDb();
  // await readDb();
  // await insertWithAddOperation();
  await getValues();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
