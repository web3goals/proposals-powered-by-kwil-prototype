import Layout from "@/components/layout";
import {
  FullWidthSkeleton,
  LargeLoadingButton,
  ThickDivider,
  WidgetBox,
  WidgetContentBox,
  WidgetTitle,
} from "@/components/styled";
import useError from "@/hooks/useError";
import useKwil from "@/hooks/useKwil";
import { palette } from "@/theme/palette";
import { addressToShortAddress } from "@/utils/converters";
import { Box, Link as MuiLink, Typography } from "@mui/material";
import { polygon } from "@wagmi/chains";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * Page with a proposal
 */
export default function Proposal() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout maxWidth="sm">
      {id ? (
        <>
          <ProposalParams id={id as string} />
          <ThickDivider sx={{ my: 6 }} />
          <ProposalVotes id={id as string} />
          <ThickDivider sx={{ my: 6 }} />
          <ProposalComments id={id as string} />
        </>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}

function ProposalParams(props: { id: string }) {
  const { getProposal } = useKwil();
  const { handleError } = useError();
  const [proposal, setProposal] = useState<any>();

  useEffect(() => {
    setProposal(undefined);
    if (props.id) {
      getProposal(props.id)
        .then((proposal) => setProposal(proposal))
        .catch((error) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  if (proposal) {
    return (
      <>
        <Typography variant="h4" textAlign="center" fontWeight={700}>
          💡 Proposal
        </Typography>
        <Typography textAlign="center" mt={1}>
          {props.id}
        </Typography>
        <WidgetBox bgcolor={palette.blue} mt={2}>
          <WidgetTitle>Description</WidgetTitle>
          <WidgetContentBox>{proposal.description}</WidgetContentBox>
        </WidgetBox>
        <WidgetBox bgcolor={palette.purpleDark} mt={2}>
          <WidgetTitle>Token</WidgetTitle>
          <WidgetContentBox>
            <MuiLink
              href={
                polygon.blockExplorers.default.url +
                "/address/" +
                proposal.token_address
              }
              target="_blank"
            >
              {addressToShortAddress(proposal.token_address)}
            </MuiLink>
          </WidgetContentBox>
        </WidgetBox>
        <WidgetBox bgcolor={palette.greyDark} mt={2}>
          <WidgetTitle>Proposer</WidgetTitle>
          <WidgetContentBox>
            <MuiLink
              href={
                polygon.blockExplorers.default.url +
                "/address/" +
                proposal.proposer
              }
              target="_blank"
            >
              {addressToShortAddress(proposal.proposer)}
            </MuiLink>
          </WidgetContentBox>
        </WidgetBox>
        <WidgetBox bgcolor={palette.greyLight} mt={2}>
          <WidgetTitle>Posted</WidgetTitle>
          <WidgetContentBox>
            {new Date(proposal.create_time).toLocaleDateString()}
          </WidgetContentBox>
        </WidgetBox>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Link href={`/proposals/share/${props.id}`} passHref legacyBehavior>
            <LargeLoadingButton variant="outlined" sx={{ mt: 2 }}>
              Share
            </LargeLoadingButton>
          </Link>
        </Box>
      </>
    );
  }

  return <FullWidthSkeleton />;
}

function ProposalVotes(props: { id: string }) {
  return <FullWidthSkeleton />;
}

function ProposalComments(props: { id: string }) {
  return <FullWidthSkeleton />;
}
