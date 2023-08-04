import CommentDialog from "@/components/dialog/CommentDialog";
import VoteDialog from "@/components/dialog/VoteDialog";
import EntityList from "@/components/entity/EntityList";
import Layout from "@/components/layout";
import {
  CardBox,
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
import { emojiAvatarForAddress } from "@/utils/avatars";
import { addressToShortAddress } from "@/utils/converters";
import { Avatar, Box, Link as MuiLink, Stack, Typography } from "@mui/material";
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
          <ProposalComments
            id={id as string}
            tokenAddress={proposal.token_address}
          />
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
      <Typography
        variant="body2"
        color="text.secondary"
        textAlign="center"
        mt={1}
      >
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

function ProposalComments(props: { id: string; tokenAddress: string }) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { getComments } = useKwil();
  const { handleError } = useError();
  const [comments, setComments] = useState<any>();

  /**
   * Define comments
   */
  async function loadComments() {
    try {
      setComments(undefined);
      const comments = await getComments(props.id);
      setComments(comments);
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  if (comments) {
    return (
      <>
        <Typography variant="h4" textAlign="center" fontWeight={700}>
          💬 Comments
        </Typography>
        <Typography textAlign="center" mt={1}>
          posted by holders of community tokens
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          <LargeLoadingButton
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() =>
              showDialog?.(
                <CommentDialog
                  proposalId={props.id}
                  proposalTokenAddress={props.tokenAddress}
                  onComment={() => loadComments()}
                  onClose={closeDialog}
                />
              )
            }
          >
            Post
          </LargeLoadingButton>
        </Box>
        <EntityList
          entities={comments}
          renderEntityCard={(comment, index) => (
            <ProposalCommentCard comment={comment} key={index} />
          )}
          noEntitiesText="😐 no comments"
          sx={{ mt: 4 }}
        />
      </>
    );
  }

  function ProposalCommentCard(props: { comment: any }) {
    return (
      <CardBox sx={{ display: "flex", flexDirection: "row" }}>
        {/* Left part */}
        <Box>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              borderRadius: 48,
              background: emojiAvatarForAddress(props.comment.commentator)
                .color,
            }}
          >
            <Typography fontSize={22}>
              {emojiAvatarForAddress(props.comment.commentator).emoji}
            </Typography>
          </Avatar>
        </Box>
        {/* Right part */}
        <Box width={1} ml={1.5} display="flex" flexDirection="column">
          <MuiLink
            fontWeight={700}
            variant="body2"
            href={
              polygon.blockExplorers.default.url +
              "/address/" +
              props.comment.commentator
            }
            target="_blank"
          >
            {addressToShortAddress(props.comment.commentator)}
          </MuiLink>
          <Typography variant="body2" color="text.secondary">
            {new Date(props.comment.create_time).toLocaleString()}
            <Typography mt={1}>{props.comment.comment_text}</Typography>
          </Typography>
        </Box>
      </CardBox>
    );
  }

  return <FullWidthSkeleton />;
}
