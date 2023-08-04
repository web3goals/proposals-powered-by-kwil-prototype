import { BrowserProvider } from "ethers";
import { Utils, WebKwil } from "kwil";
import { v4 as uuidv4 } from "uuid";

/**
 * Hook for work with Kwil.
 */
export default function useKwil() {
  const kwil: WebKwil = new WebKwil({
    kwilProvider: process.env.NEXT_PUBLIC_KWIL_PROVIDER as string,
  });
  const dbid: string = Utils.generateDBID(
    process.env.NEXT_PUBLIC_KWIL_DATABASE_OWNER as string,
    process.env.NEXT_PUBLIC_KWIL_DATABASE_NAME as string
  );

  let getProposal = async function (id: string): Promise<Object | undefined> {
    const response = await kwil.selectQuery(
      dbid,
      `SELECT * FROM proposals WHERE id = '${id}'`
    );
    return response?.data?.[0];
  };

  let getProposals = async function (): Promise<Object[] | undefined> {
    const response = await kwil.selectQuery(
      dbid,
      `SELECT * FROM proposals ORDER BY create_time DESC`
    );
    return response?.data;
  };

  let postProposal = async function (
    tokenAddress: string,
    description: string
  ): Promise<string> {
    const provider: BrowserProvider = new BrowserProvider(
      (window as any).ethereum
    );
    const signer = await provider.getSigner();
    const id = uuidv4();
    const createTime = new Date().getTime();
    const input = new Utils.ActionInput()
      .put("$id", id)
      .put("$token_address", tokenAddress)
      .put("$create_time", createTime)
      .put("$description", description);
    const tx = await kwil
      .actionBuilder()
      .dbid(dbid)
      .name("post_proposal")
      .concat(input)
      .signer(signer)
      .buildTx();
    await kwil.broadcast(tx);
    return id;
  };

  let getVotes = async function (
    proposalId: string
  ): Promise<Object[] | undefined> {
    const response = await kwil.selectQuery(
      dbid,
      `SELECT * FROM votes WHERE proposal_id = '${proposalId}'`
    );
    return response?.data;
  };

  let getAvailableVotes = async function (
    proposalId: string,
    tokenAddress: string
  ): Promise<number | undefined> {
    const provider: BrowserProvider = new BrowserProvider(
      (window as any).ethereum
    );
    const signer = await provider.getSigner();
    const input = new Utils.ActionInput()
      .put("$proposal_id", proposalId)
      .put("$token_address", tokenAddress);
    const tx = await kwil
      .actionBuilder()
      .dbid(dbid)
      .name("get_available_votes")
      .concat(input)
      .signer(signer)
      .buildTx();
    const response = await kwil.broadcast(tx);
    return (response?.data?.body?.[0] as any)?.available_votes;
  };

  let voteFor = async function (proposalId: string, tokenAddress: string) {
    const provider: BrowserProvider = new BrowserProvider(
      (window as any).ethereum
    );
    const signer = await provider.getSigner();
    const id = uuidv4();
    const createTime = new Date().getTime();
    const input = new Utils.ActionInput()
      .put("$id", id)
      .put("$proposal_id", proposalId)
      .put("$create_time", createTime)
      .put("$token_address", tokenAddress);
    const tx = await kwil
      .actionBuilder()
      .dbid(dbid)
      .name("vote_for")
      .concat(input)
      .signer(signer)
      .buildTx();
    await kwil.broadcast(tx);
  };

  let voteAgainst = async function (proposalId: string, tokenAddress: string) {
    const provider: BrowserProvider = new BrowserProvider(
      (window as any).ethereum
    );
    const signer = await provider.getSigner();
    const id = uuidv4();
    const createTime = new Date().getTime();
    const input = new Utils.ActionInput()
      .put("$id", id)
      .put("$proposal_id", proposalId)
      .put("$create_time", createTime)
      .put("$token_address", tokenAddress);
    const tx = await kwil
      .actionBuilder()
      .dbid(dbid)
      .name("vote_against")
      .concat(input)
      .signer(signer)
      .buildTx();
    await kwil.broadcast(tx);
  };

  let getComments = async function (proposalId: string) {
    const response = await kwil.selectQuery(
      dbid,
      `SELECT * FROM comments WHERE proposal_id = '${proposalId}' ORDER BY create_time DESC`
    );
    return response?.data;
  };

  let postComment = async function (
    proposalId: string,
    commentText: string,
    tokenAddress: string
  ) {
    const provider: BrowserProvider = new BrowserProvider(
      (window as any).ethereum
    );
    const signer = await provider.getSigner();
    const id = uuidv4();
    const createTime = new Date().getTime();
    const input = new Utils.ActionInput()
      .put("$id", id)
      .put("$proposal_id", proposalId)
      .put("$create_time", createTime)
      .put("$comment_text", commentText)
      .put("$token_address", tokenAddress);
    const tx = await kwil
      .actionBuilder()
      .dbid(dbid)
      .name("post_comment")
      .concat(input)
      .signer(signer)
      .buildTx();
    await kwil.broadcast(tx);
  };

  return {
    getProposal,
    getProposals,
    postProposal,
    getVotes,
    getAvailableVotes,
    voteFor,
    voteAgainst,
    getComments,
    postComment,
  };
}
