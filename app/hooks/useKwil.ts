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

  let getProposal = async function (id: string) {
    return await kwil.selectQuery(
      dbid,
      `SELECT * FROM proposals WHERE id = '${id}'`
    );
  };

  let getProposals = async function () {
    return await kwil.selectQuery(
      dbid,
      `SELECT * FROM proposals ORDER BY create_time DESC`
    );
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
      .put("$id", uuidv4())
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

  return {
    getProposal,
    getProposals,
    postProposal,
  };
}
