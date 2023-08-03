import Layout from "@/components/layout";
import { useRouter } from "next/router";

/**
 * Page with a proposal
 */
export default function ShareProposal() {
  const router = useRouter();
  const { id } = router.query;

  return <Layout maxWidth="sm">...</Layout>;
}
