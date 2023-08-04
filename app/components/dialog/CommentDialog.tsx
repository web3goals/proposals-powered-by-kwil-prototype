import useError from "@/hooks/useError";
import useKwil from "@/hooks/useKwil";
import useToasts from "@/hooks/useToast";
import { Dialog, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import { useState } from "react";
import { useNetwork } from "wagmi";
import FormikHelper from "../helper/FormikHelper";
import {
  DialogCenterContent,
  ExtraLargeLoadingButton,
  WidgetBox,
  WidgetInputTextField,
  WidgetTitle,
} from "../styled";
import * as yup from "yup";
import { palette } from "@/theme/palette";

export default function CommentDialog(props: {
  proposalId: string;
  proposalTokenAddress: string;
  isClose?: boolean;
  onClose?: Function;
  onComment?: Function;
}) {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { showToastSuccess } = useToasts();
  const { postComment } = useKwil();

  /**
   * Dialog states
   */
  const [isOpen, setIsOpen] = useState(!props.isClose);

  /**
   * Form states
   */
  const [formValues, setFormValues] = useState({
    text: "",
  });
  const formValidationSchema = yup.object({
    text: yup.string().required(),
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  /**
   * Function to close dialog
   */
  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  async function submit(values: any) {
    try {
      setIsFormSubmitting(true);
      // Check connected chain
      if (chain?.unsupported !== false) {
        throw new Error("Wallet is not connected or network is wrong");
      }
      // Upload data to database
      await postComment(
        props.proposalId,
        values.text,
        props.proposalTokenAddress
      );
      // Display success toast and redirect to share page
      showToastSuccess("Comment is posted");
      props.onComment?.();
      close();
    } catch (error: any) {
      handleError(error, true);
      setIsFormSubmitting(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={!isFormSubmitting ? close : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogCenterContent>
        <Typography variant="h4" textAlign="center" fontWeight={700}>
          ✍️ Post a comment
        </Typography>
        <Typography textAlign="center" mt={1}>
          Share your opinion with the community
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
                <WidgetTitle>Text</WidgetTitle>
                <WidgetInputTextField
                  id="text"
                  name="text"
                  placeholder="That's a great idea!"
                  value={values.text}
                  onChange={handleChange}
                  error={touched.text && Boolean(errors.text)}
                  helperText={touched.text && errors.text}
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
      </DialogCenterContent>
    </Dialog>
  );
}
