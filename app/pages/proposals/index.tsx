import Layout from "@/components/layout";
import useError from "@/hooks/useError";
import useKwil from "@/hooks/useKwil";
import { useEffect } from "react";

/**
 * Page with all proposals
 */
export default function Proposals() {
  const { handleError } = useError();
  const { getProposals } = useKwil();

  useEffect(() => {
    getProposals()
      .then((proposals) => console.log("proposals", proposals))
      .catch((error) => handleError(error, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Layout>...</Layout>;
}
