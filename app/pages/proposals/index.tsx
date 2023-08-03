import Layout from "@/components/layout";
import useKwil from "@/hooks/useKwil";
import { useEffect } from "react";

/**
 * Page with all proposals
 */
export default function Proposals() {
  const { getProposals } = useKwil();

  useEffect(() => {
    getProposals().then((proposals) =>
      console.log("proposals", proposals?.data)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Layout>...</Layout>;
}
