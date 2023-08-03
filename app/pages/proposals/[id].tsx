import VoteDialog from "@/components/dialog/VoteDialog";
import Layout from "@/components/layout";
import {
  FullWidthSkeleton,
  LargeLoadingButton,
  ThickDivider,
  VotesLinearProgress,
  WidgetBox,
  WidgetContentBox,
  WidgetTitle,
} from "@/components/styled";
import { DialogContext } from "@/context/dialog";
import useError from "@/hooks/useError";
import useKwil from "@/hooks/useKwil";
import { palette } from "@/theme/palette";
import { addressToShortAddress } from "@/utils/converters";
import { Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import { polygon } from "@wagmi/chains";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

/**
 * Page with a proposal
 */
export default function Proposal() {
  const router = useRouter();
  const { id } = router.query;
  const { getProposal } = useKwil();
  const { handleError } = useError();
  const [proposal, setProposal] = useState<any>();

  useEffect(() => {
    setProposal(undefined);
    if (id) {
      getProposal(id as string)
        .then((proposal) => setProposal(proposal))
        .catch((error) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Layout maxWidth="sm">
      {proposal ? (
        <>
          <ProposalParams
            id={id as string}
            description={proposal.description}
            tokenAddress={proposal.token_address}
            proposer={proposal.proposer}
            createTime={proposal.create_time}
          />
          <ThickDivider sx={{ my: 6 }} />
          <ProposalVotes
            id={id as string}
            tokenAddress={proposal.token_address}
          />
          <ThickDivider sx={{ my: 6 }} />
          <ProposalComments id={id as string} />
        </>
      ) : (
        <FullWidthSkeleton />
      )}
    </Layout>
  );
}

function ProposalParams(props: {
  id: string;
  description: string;
  tokenAddress: string;
  proposer: string;
  createTime: number;
}) {
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
        <WidgetContentBox>{props.description}</WidgetContentBox>
      </WidgetBox>
      <WidgetBox bgcolor={palette.purpleDark} mt={2}>
        <WidgetTitle>Token</WidgetTitle>
        <WidgetContentBox>
          <MuiLink
            href={
              polygon.blockExplorers.default.url +
              "/address/" +
              props.tokenAddress
            }
            target="_blank"
          >
            {addressToShortAddress(props.tokenAddress)}
          </MuiLink>
        </WidgetContentBox>
      </WidgetBox>
      <WidgetBox bgcolor={palette.greyDark} mt={2}>
        <WidgetTitle>Proposer</WidgetTitle>
        <WidgetContentBox>
          <MuiLink
            href={
              polygon.blockExplorers.default.url + "/address/" + props.proposer
            }
            target="_blank"
          >
            {addressToShortAddress(props.proposer)}
          </MuiLink>
        </WidgetContentBox>
      </WidgetBox>
      <WidgetBox bgcolor={palette.greyLight} mt={2}>
        <WidgetTitle>Posted</WidgetTitle>
        <WidgetContentBox>
          {new Date(props.createTime).toLocaleDateString()}
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

function ProposalVotes(props: { id: string; tokenAddress: string }) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { getVotes } = useKwil();
  const { handleError } = useError();
  const [votes, setVotes] = useState<
    { votesFor: number; votesAgainst: number; votesTotal: number } | undefined
  >();

  /**
   * Define votes
   */
  async function loadVotes() {
    try {
      setVotes(undefined);
      const votes = await getVotes(props.id);
      console.log("votes", votes);
      let votesFor = 0;
      let votesAgainst = 0;
      if (votes) {
        for (const vote of votes) {
          votesFor += (vote as any).votes_for;
          votesAgainst += (vote as any).votes_against;
        }
      }
      setVotes({
        votesFor: votesFor,
        votesAgainst: votesAgainst,
        votesTotal: votesFor + votesAgainst,
      });
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadVotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  if (votes) {
    return (
      <>
        <Typography variant="h4" textAlign="center" fontWeight={700}>
          🗣️ Votes
        </Typography>
        <Typography textAlign="center" mt={1}>
          of holders of community tokens
        </Typography>
        <Stack direction="row" justifyContent="space-between" mt={2}>
          <Typography variant="h6" fontWeight={700} color="green">
            {votes.votesFor} for
          </Typography>
          <Typography variant="h6" fontWeight={700} color="red">
            {votes.votesAgainst} against
          </Typography>
        </Stack>
        <VotesLinearProgress
          variant="determinate"
          value={(votes.votesFor / votes.votesTotal) * 100}
          sx={{ mt: 1, borderRadius: 5 }}
        />
        <Box display="flex" flexDirection="column" alignItems="center">
          <LargeLoadingButton
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() =>
              showDialog?.(
                <VoteDialog
                  proposalId={props.id}
                  proposalTokenAddress={props.tokenAddress}
                  onVote={() => loadVotes()}
                  onClose={closeDialog}
                />
              )
            }
          >
            Vote
          </LargeLoadingButton>
        </Box>
      </>
    );
  }

  return <FullWidthSkeleton />;
}

function ProposalComments(props: { id: string }) {
  return <FullWidthSkeleton />;
}
