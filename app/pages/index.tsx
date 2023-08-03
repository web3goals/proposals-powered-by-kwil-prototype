import Layout from "@/components/layout";
import { ExtraLargeLoadingButton } from "@/components/styled";
import { Box, Typography } from "@mui/material";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";

/**
 * Landing page
 */
export default function Landing() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <Layout maxWidth="xl" hideToolbar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 6,
        }}
      >
        <Box width={{ xs: "100%", md: "60%", lg: "50%" }}>
          <Image
            src="/images/ideas.png"
            alt="Ideas"
            width="100"
            height="100"
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Box>
        <Typography variant="h1" textAlign="center" fontWeight={700} mt={2}>
          🚀 Boost your community with proposals
        </Typography>
        <Typography variant="h4" textAlign="center" mt={1}>
          without smart contracts and transaction fees
        </Typography>
        {address ? (
          <Link href={`/proposals/post`}>
            <ExtraLargeLoadingButton variant="contained" sx={{ mt: 4 }}>
              Let’s go!
            </ExtraLargeLoadingButton>
          </Link>
        ) : (
          <ExtraLargeLoadingButton
            variant="contained"
            sx={{ mt: 4 }}
            onClick={() => openConnectModal?.()}
          >
            Let’s go!
          </ExtraLargeLoadingButton>
        )}
      </Box>
    </Layout>
  );
}
