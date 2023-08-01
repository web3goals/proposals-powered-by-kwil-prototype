import { Contract, JsonRpcProvider } from "ethers";
import * as fs from "fs";
import { NodeKwil } from "kwil";
import {
  ExtensionBuilder,
  InitializeFn,
  logFn,
  MethodFn,
} from "kwil-extensions";
import erc721Abi from "../abis/erc721";

require("dotenv").config();

const initialize: InitializeFn = async (
  metadata: Record<string, string>
): Promise<Record<string, string>> => {
  if (metadata["chain"] !== "polygon") {
    throw new Error("Only polygon chain is supported");
  }
  return metadata;
};

// TODO: Delete logging
const getAvailableVotes: MethodFn = async ({ metadata, inputs }) => {
  const tokenAddress = inputs[0].toString();
  const voterAddress = inputs[1].toString();
  const dbId = inputs[2].toString();
  const proposalId = inputs[3].toString();

  // Define total votes
  const provider = new JsonRpcProvider(process.env.RPC_PROVIDER);
  const token = new Contract(tokenAddress, erc721Abi, provider);
  const balance = await token["balanceOf(address)"](voterAddress);
  const totalVotes = Number(balance);
  console.log("totalVotes", totalVotes);

  // Define used votes
  const kwil = new NodeKwil({
    kwilProvider: "http://host.docker.internal:8080",
    timeout: 1000,
    logging: false,
  });
  const res = await kwil.selectQuery(
    dbId,
    `SELECT votes_for + votes_against AS used_votes FROM votes WHERE proposal_id = '${proposalId}' AND voter = '${voterAddress}'`
  );
  let usedVotes = 0;
  if ((res.data?.[0] as any)?.used_votes) {
    usedVotes = (res.data?.[0] as any)?.used_votes;
  }
  console.log("usedVotes", usedVotes);

  // Define available votes
  const availableVotes = totalVotes - usedVotes;
  console.log("availableVotes", availableVotes);
  return availableVotes;
};

const logger: logFn = (log: string) => {
  fs.appendFileSync("logs.txt", log);
};

function startProposalsExtension(): void {
  const server = new ExtensionBuilder()
    .named("proposals")
    .withInitializer(initialize)
    .withMethods({
      getAvailableVotes,
    })
    .withLoggerFn(logger)
    .port("50051")
    .build();

  process.on("SIGINT", () => {
    server.stop();
  });

  process.on("SIGTERM", () => {
    server.stop();
  });
}

export default startProposalsExtension;
