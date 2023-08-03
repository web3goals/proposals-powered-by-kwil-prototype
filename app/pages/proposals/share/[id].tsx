import Layout from "@/components/layout";
import { useRouter } from "next/router";

/**
 * Page to share a proposal
 */
export default function ShareProposal() {
  const router = useRouter();
  const { id } = router.query;

  return <Layout>...</Layout>;
}
