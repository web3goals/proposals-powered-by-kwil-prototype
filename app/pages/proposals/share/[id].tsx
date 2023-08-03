import Layout from "@/components/layout";
import { LargeLoadingButton } from "@/components/styled";
import useToasts from "@/hooks/useToast";
import { Telegram, Twitter } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

/**
 * Page to share a proposal
 */
export default function ShareProposal() {
  const router = useRouter();
  const { id } = router.query;
  const { showToastSuccess } = useToasts();

  const proposalLink = `${global.window.location.origin}/proposals/${id}`;
  const twitterLink = `https://twitter.com/intent/tweet?url=${proposalLink}`;
  const telegramLink = `https://t.me/share/url?url=${proposalLink}`;

  return (
    <Layout maxWidth="sm">
      <Typography variant="h4" textAlign="center" fontWeight={700}>
        📢 Share the link
      </Typography>
      <Typography textAlign="center" mt={1}>
        to the proposal with your community
      </Typography>
      {/* Buttons to share via social networks */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
        <IconButton
          href={twitterLink}
          target="_blank"
          color="primary"
          sx={{ border: 4, p: 3 }}
        >
          <Twitter sx={{ fontSize: 36 }} />
        </IconButton>
        <IconButton
          href={telegramLink}
          target="_blank"
          color="primary"
          sx={{ border: 4, p: 3 }}
        >
          <Telegram sx={{ fontSize: 36 }} />
        </IconButton>
      </Stack>
      {/* Link and copy button */}
      <Box
        sx={{
          width: 1,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          border: 3,
          borderColor: "divider",
          borderRadius: 5,
          px: { xs: 1, md: 2 },
          py: { xs: 2, md: 1 },
          mt: 3,
        }}
      >
        <Link href={proposalLink} legacyBehavior passHref>
          <MuiLink
            sx={{
              lineBreak: "anywhere",
              fontWeight: 700,
              textAlign: "center",
              mb: { xs: 2, md: 0 },
              mr: { xs: 0, md: 2 },
            }}
          >
            {proposalLink}
          </MuiLink>
        </Link>
        <LargeLoadingButton
          variant="outlined"
          onClick={() => {
            navigator.clipboard.writeText(proposalLink);
            showToastSuccess("Link copied");
          }}
        >
          Copy
        </LargeLoadingButton>
      </Box>
    </Layout>
  );
}
