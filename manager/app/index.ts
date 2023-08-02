import * as dotenv from "dotenv";
import { JsonRpcProvider, Wallet } from "ethers";
import { NodeKwil, Types, Utils } from "kwil";
import { v4 as uuidv4 } from "uuid";
import { SchemaObj } from "./interfaces";
import proposalsSchema from "./schemes/proposals.json";

dotenv.config();

const kwil = new NodeKwil({
  kwilProvider: "http://localhost:8080",
  timeout: 1000,
  logging: false,
});

const provider = new JsonRpcProvider(process.env.RPC_PROVIDER);
const walletOne = new Wallet(process.env.PRIVATE_KEY_1 as string, provider);
const walletTwo = new Wallet(process.env.PRIVATE_KEY_2 as string, provider);
const tokenAddress = "0x60f028c82f9f3bf71e0c13fe9e8e7f916b345c00";

async function createDatabase() {
  console.log("🚩 createDatabase()");
  let schema: SchemaObj = proposalsSchema;
  schema.owner = walletOne.address;
  const dbTx: Types.Transaction = await kwil
    .dbBuilder()
    .signer(walletOne)
    .payload(schema)
    .buildTx();
  const res = await kwil.broadcast(dbTx);
  console.log("res", res);
}

async function postProposal() {
  console.log("🚩 postProposal()");
  const createTime = new Date().getTime();
  const input = new Utils.ActionInput()
    .put("$id", uuidv4())
    .put("$token_address", tokenAddress)
    .put("$create_time", createTime)
    .put("$description", "Let's build a teleport!");
  const tx: Types.Transaction = await kwil
    .actionBuilder()
    .name("post_proposal")
    .dbid(kwil.getDBID(walletOne.address, proposalsSchema.name))
    .signer(walletOne)
    .concat(input)
    .buildTx();
  const res = await kwil.broadcast(tx);
  console.log("res", res);
}

async function getProposals() {
  console.log("🚩 getProposals()");
  const res = await kwil.selectQuery(
    kwil.getDBID(walletOne.address, proposalsSchema.name),
    "SELECT * FROM proposals"
  );
  console.log("res.data", res.data);
}

async function vote() {
  console.log("🚩 vote()");
  const createTime = new Date().getTime();
  const input = new Utils.ActionInput()
    .put("$id", uuidv4())
    .put("$proposal_id", "00000000-0000-0000-0000-000000000000")
    .put("$create_time", createTime)
    .put("$token_address", tokenAddress);
  const tx: Types.Transaction = await kwil
    .actionBuilder()
    .name("vote_for")
    .dbid(kwil.getDBID(walletOne.address, proposalsSchema.name))
    .signer(walletOne)
    .concat(input)
    .buildTx();
  const res = await kwil.broadcast(tx);
  console.log("res", res);
}

async function getVotes() {
  console.log("🚩 getVotes()");
  const res = await kwil.selectQuery(
    kwil.getDBID(walletOne.address, proposalsSchema.name),
    "SELECT * FROM votes"
  );
  console.log("res.data", res.data);
}

async function sandbox() {
  console.log("🚩 sandbox()");
}

async function main() {
  console.log("🚩 main()");
  // await createDatabase();
  // await postProposal();
  // await getProposals();
  // await vote();
  // await getVotes();
  // await vote();
  // await getVotes();
  // await sandbox();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
