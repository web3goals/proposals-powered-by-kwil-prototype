import EntityList from "@/components/entity/EntityList";
import Layout from "@/components/layout";
import { CardBox } from "@/components/styled";
import useError from "@/hooks/useError";
import useKwil from "@/hooks/useKwil";
import { emojiAvatarForAddress } from "@/utils/avatars";
import { addressToShortAddress } from "@/utils/converters";
import { Avatar, Box, Link as MuiLink, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { polygon } from "viem/chains";

/**
 * Page with all proposals
 */
export default function Proposals() {
  const { handleError } = useError();
  const { getProposals } = useKwil();
  const [proposals, setProposals] = useState<any>();

  useEffect(() => {
    getProposals()
      .then((proposals) => setProposals(proposals))
      .catch((error) => handleError(error, true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout maxWidth="sm">
      <Typography variant="h4" textAlign="center" fontWeight={700}>
        💡 Proposals
      </Typography>
      <Typography textAlign="center" mt={1}>
        that can boost your community
      </Typography>
      <EntityList
        entities={proposals}
        renderEntityCard={(proposal, index) => (
          <ProposalCard proposal={proposal} key={index} />
        )}
        noEntitiesText="😐 no proposals"
        sx={{ mt: 4 }}
      />
    </Layout>
  );
}

function ProposalCard(props: { proposal: any }) {
  return (
    <CardBox sx={{ display: "flex", flexDirection: "row" }}>
      {/* Left part */}
      <Box>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            borderRadius: 48,
            background: emojiAvatarForAddress(props.proposal.proposer).color,
          }}
        >
          <Typography fontSize={22}>
            {emojiAvatarForAddress(props.proposal.proposer).emoji}
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
            props.proposal.proposer
          }
          target="_blank"
        >
          {addressToShortAddress(props.proposal.proposer)}
        </MuiLink>
        <Typography variant="body2" color="text.secondary">
          {new Date(props.proposal.create_time).toLocaleString()}
        </Typography>
        <Link href={`/proposals/${props.proposal.id}`} passHref legacyBehavior>
          <MuiLink variant="h6" fontWeight={700} mt={1}>
            {props.proposal.description}
          </MuiLink>
        </Link>
        <Stack direction="row" spacing={1} mt={1}>
          <Typography variant="body2" color="text.secondary">
            💡 Proposal for{" "}
          </Typography>
          <MuiLink
            fontWeight={700}
            variant="body2"
            href={
              polygon.blockExplorers.default.url +
              "/address/" +
              props.proposal.proposer
            }
            target="_blank"
          >
            {addressToShortAddress(props.proposal.token_address)}
          </MuiLink>
        </Stack>
      </Box>
    </CardBox>
  );
}
