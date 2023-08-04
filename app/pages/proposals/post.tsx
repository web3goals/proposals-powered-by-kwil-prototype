import FormikHelper from "@/components/helper/FormikHelper";
import Layout from "@/components/layout";
import {
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputTextField,
  WidgetTitle,
} from "@/components/styled";
import useError from "@/hooks/useError";
import useKwil from "@/hooks/useKwil";
import useToasts from "@/hooks/useToast";
import { palette } from "@/theme/palette";
import { Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { useNetwork } from "wagmi";
import * as yup from "yup";

/**
 * Page to post a proposal
 */
export default function PostProposal() {
  const router = useRouter();
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { showToastSuccess } = useToasts();
  const { postProposal } = useKwil();

  /**
   * Form states
   */
  const [formValues, setFormValues] = useState({
    description: "",
    tokenAddress: "",
  });
  const formValidationSchema = yup.object({
    description: yup.string().required(),
    tokenAddress: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  async function submit(values: any) {
    try {
      setIsFormSubmitting(true);
      // Check connected chain
      if (chain?.unsupported !== false) {
        throw new Error("Wallet is not connected or network is wrong");
      }
      // Upload data to database
      const id = await postProposal(values.tokenAddress, values.description);
      // Display success toast and redirect to share page
      showToastSuccess("Proposal is posted");
      router.push(`/proposals/share/${id}`);
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <Layout maxWidth="sm">
      <Typography variant="h4" textAlign="center" fontWeight={700}>
        🚀 Post a proposal
      </Typography>
      <Typography textAlign="center" mt={1}>
        available to all holders of community tokens (only Polygon chain)
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={submit}
      >
        {({ values, errors, touched, handleChange, setValues }) => (
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormikHelper onChange={(values: any) => setFormValues(values)} />
            {/* Description */}
            <WidgetBox bgcolor={palette.blue} mt={2}>
              <WidgetTitle>Description</WidgetTitle>
              <WidgetInputTextField
                id="description"
                name="description"
                placeholder="Let's build a teleport!"
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                disabled={isFormSubmitting}
                multiline
                maxRows={4}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Token */}
            <WidgetBox bgcolor={palette.purpleDark} mt={2}>
              <WidgetTitle>Token</WidgetTitle>
              <WidgetInputTextField
                id="tokenAddress"
                name="tokenAddress"
                placeholder="0x0000000000000000000000000000000000000000"
                value={values.tokenAddress}
                onChange={handleChange}
                error={touched.tokenAddress && Boolean(errors.tokenAddress)}
                helperText={touched.tokenAddress && errors.tokenAddress}
                disabled={isFormSubmitting}
                multiline
                maxRows={4}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Submit button */}
            <ExtraLargeLoadingButton
              loading={isFormSubmitting}
              variant="outlined"
              type="submit"
              disabled={isFormSubmitting}
              sx={{ mt: 2 }}
            >
              Submit
            </ExtraLargeLoadingButton>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
