import { useRouter } from "next/navigation";
import type { FormikHelpers } from "formik";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import type { EmailSignInDto } from "./EmailSignInDto";
import { handleSignInError } from "./handleSignInError";
import { TextField } from "../TextField/TextField";
import { Button } from "../Button/Button";
import { useAppDispatch } from "@/hooks";
import { login } from "@/store/user";
import { ON_AUTH_SUCCESS_GOTO } from "@/lib/constants/paths";

const initialValues = { email: "", password: "" };

export const EmailSignInForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = async (
    values: EmailSignInDto,
    { setSubmitting, setErrors, setFieldValue }: FormikHelpers<EmailSignInDto>
  ) => {
    setSubmitting(true);
    const res = await dispatch(login(values));
    router.prefetch(ON_AUTH_SUCCESS_GOTO);

    if (res.meta.requestStatus === "fulfilled") {
      window.location.href = ON_AUTH_SUCCESS_GOTO;
    } else {
      setFieldValue("password", "");
      const formErr = handleSignInError();
      setErrors(formErr);
    }
    setSubmitting(false);
  };

  return (
    <Formik initialValues={initialValues as EmailSignInDto} onSubmit={onSubmit}>
      {({ errors, isSubmitting }) => (
        <Form className="form">
          <div className="w-full">
            <Field
              id="email"
              as={TextField}
              name="email"
              placeholder="E-postadress"
              data-testid="emailInput"
              fullWidth={true}
            />
          </div>
          <div className="w-full">
            <Field
              as={TextField}
              id="password"
              name="password"
              placeholder="Lösenord"
              type="password"
              data-testid="passwordInput"
              fullWidth={true}
            />
            <Link
              className="block text-sm hover:underline"
              href="/glomtlosenord"
            >
              Har du glömt lösenordet?
            </Link>
          </div>

          {errors.password && (
            <span className="text-red-400">{errors.password}</span>
          )}
          <div className="btn-group">
            <Button
              type="submit"
              data-testid="formSubmitButton"
              disabled={isSubmitting}
              className="flex-grow md:flex-none"
            >
              Logga in
            </Button>
            <Link href="/nyttkonto">
              <Button className="flex-grow md:flex-none btn-outlined">
                Nytt konto
              </Button>
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};