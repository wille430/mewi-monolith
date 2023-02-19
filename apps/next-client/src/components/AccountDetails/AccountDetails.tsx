import {useState} from "react";
import styles from "./AccountDetails.module.scss";
import {TextField} from "../TextField/TextField";
import {Button} from "../Button/Button";
import {updateEmail} from "@/client";
import {randomString} from "@mewi/utilities";
import {ErrorMessage, Field, Form, Formik} from "formik";
import type {FormikHelpers} from "formik";
import type {UpdateEmailDto} from "@/lib/modules/users/dto/update-email.dto";
import {handleError} from "./handleError";
import {updateEmailSchema} from "@/client/users/schemas/update-email.schema";
import {mutate} from "swr";
import {UserDto} from "@mewi/models";

export interface AccountDetailsProps {
    user: UserDto
}

const AccountDetails = ({user}: AccountDetailsProps) => {
    const initialValues: UpdateEmailDto = {
        newEmail: user.email,
    };

    const [success, setSuccess] = useState<string | undefined>();

    const handleSubmit = async (
        values: UpdateEmailDto,
        {setErrors}: FormikHelpers<UpdateEmailDto>
    ) => {
        if (
            values.newEmail !== user?.email &&
            confirm(
                `Är du säker att du vill uppdatera din e-postadress från ${user?.email} till ${values?.newEmail}?`
            )
        ) {
            await mutate(...updateEmail(values.newEmail ?? ""))
                .then(() =>
                    setSuccess(
                        `Ett meddelande har skickats till ${values.newEmail} för att verifiera adressen`
                    )
                )
                .catch((e) => {
                    setSuccess(undefined);
                    setErrors(handleError(e));
                });
        }
    };

    return (
        <section className={styles.container}>
            <h4>Kontouppgifter</h4>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={updateEmailSchema}
            >
                {({isSubmitting, errors, values}) => (
                    <Form className={styles.form}>
                        <div>
                            <label>E-postaddress</label>
                            <Field as={TextField} name="newEmail"/>
                            <ErrorMessage name="newEmail"/>
                        </div>
                        <div>
                            <label>Lösenord</label>
                            <TextField
                                type="password"
                                value={randomString(16)}
                                disabled
                                fullWidth
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                Object.keys(errors).length > 0 ||
                                user.email == values.newEmail
                            }
                        >
                            Uppdatera
                        </Button>
                        <span className="text-green-500">{success}</span>
                    </Form>
                )}
            </Formik>
        </section>
    );
};

export default AccountDetails;
