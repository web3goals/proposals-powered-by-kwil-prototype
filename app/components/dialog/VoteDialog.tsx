import useError from "@/hooks/useError";
import useKwil from "@/hooks/useKwil";
import useToasts from "@/hooks/useToast";
import { palette } from "@/theme/palette";
import { Dialog, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNetwork } from "wagmi";
import {
  DialogCenterContent,
  FullWidthSkeleton,
  LargeLoadingButton,
} from "../styled";

export default function VoteDialog(props: {
  proposalId: string;
  proposalTokenAddress: string;
  isClose?: boolean;
  onClose?: Function;
  onVote?: Function;
}) {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { showToastSuccess } = useToasts();
  const { getAvailableVotes, voteFor, voteAgainst } = useKwil();
  const [availableVotes, setAvailableVotes] = useState<any>();
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  /**
   * Dialog states
   */
  const [isOpen, setIsOpen] = useState(!props.isClose);

  /**
   * Function to close dialog
   */
  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  async function voteForProposal() {
    try {
      setIsFormSubmitting(true);
      // Check connected chain
      if (chain?.unsupported !== false) {
        throw new Error("Wallet is not connected or network is wrong");
      }
      // Vote
      await voteFor(props.proposalId, props.proposalTokenAddress);
      // Display success toast and close dialog
      showToastSuccess("You voted for");
      props.onVote?.();
      close();
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  async function voteAgainstProposal() {
    try {
      setIsFormSubmitting(true);
      // Check connected chain
      if (chain?.unsupported !== false) {
        throw new Error("Wallet is not connected or network is wrong");
      }
      // Vote
      await voteAgainst(props.proposalId, props.proposalTokenAddress);
      // Display success toast and close dialog
      showToastSuccess("You voted against");
      props.onVote?.();
      close();
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  /**
   * Define available votes
   */
  useEffect(() => {
    setAvailableVotes(undefined);
    if (props.proposalId && props.proposalTokenAddress) {
      getAvailableVotes(props.proposalId, props.proposalTokenAddress)
        .then((availableVotes) => setAvailableVotes(availableVotes))
        .catch((error) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.proposalId, props.proposalTokenAddress]);

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogCenterContent>
        {availableVotes ? (
          <>
            <Typography variant="h4" fontWeight={700} textAlign="center">
              🗣️ Make your decision
            </Typography>
            <Typography textAlign="center" mt={1}>
              You have <strong>{availableVotes} votes</strong>
            </Typography>
            {availableVotes > 0 && (
              <Stack>
                <LargeLoadingButton
                  variant="contained"
                  sx={{ mt: 2, background: palette.green }}
                  disabled={isFormSubmitting}
                  onClick={() => voteForProposal()}
                >
                  Vote For
                </LargeLoadingButton>
                <LargeLoadingButton
                  variant="contained"
                  sx={{ mt: 2, background: palette.red }}
                  disabled={isFormSubmitting}
                  onClick={() => voteAgainstProposal()}
                >
                  Vote Against
                </LargeLoadingButton>
              </Stack>
            )}
          </>
        ) : (
          <FullWidthSkeleton />
        )}
      </DialogCenterContent>
    </Dialog>
  );
}
