import {createUserWatcher} from "@/client/user-watchers/mutations";
import {createUserWatcherSchema} from "@/client/user-watchers/schemas/create-user-watcher.schema";
import {useAppSelector} from "@/hooks";
import type {WatcherMetadata} from "@mewi/entities";
import type {CreateUserWatcherDto} from "@/lib/modules/user-watchers/dto/create-user-watcher.dto";
import {Form, Formik} from "formik";
import type {FormikHelpers} from "formik";
import {useRouter} from "next/navigation";
import {useSWRConfig} from "swr";
import {Button} from "../../Button/Button";
import {ConfirmModal} from "../../ConfirmModal/ConfirmModal";
import {handleError} from "./handleError";
import {ListingSearchForm} from "../../ListingSearchForm/ListingSearchForm";
import clsx from "clsx";

const initialValues: CreateUserWatcherDto["metadata"] = {};

export type CreateWatcherFormProps = {
    onSuccess?: () => any
    className?: string
}

export const CreateWatcherForm = (props: CreateWatcherFormProps) => {
    const {onSuccess, className} = props;
    const {mutate} = useSWRConfig();

    const router = useRouter();
    const {isLoggedIn} = useAppSelector((state) => state.user);

    const handleSubmit = async (
        values: typeof initialValues,
        {setErrors}: FormikHelpers<WatcherMetadata>
    ) => {
        try {
            await mutate(
                ...createUserWatcher({
                    metadata: values,
                })
            );
            return onSuccess && onSuccess();
        } catch (e) {
            return setErrors(handleError(e));
        }
    };

    return (
        <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={createUserWatcherSchema}
        >
            {({resetForm, submitForm, errors}) => (
                <Form>
                    <div className={clsx("space-y-2", className)}>
                        <ListingSearchForm/>
                    </div>

                    <footer className="flex justify-end pt-4">
                        <span className="text-red-400">{(errors as any).all}</span>
                        <div className="flex flex-col-reverse gap-2 sm:flex-row">
                            <Button
                                type="button"
                                onClick={() => resetForm}
                                className="btn-outlined"
                            >
                                Rensa filter
                            </Button>
                            <ConfirmModal
                                modalProps={{
                                    heading:
                                        "Är du säker att du vill lägga en bevakning på sökningen?",
                                    bodyText:
                                        "Genom att klicka på \"Ja\" godkänner du att ta emot e-post varje gång det kommer nya föremål som matchar din sökning.",
                                    onAccept: submitForm,
                                }}
                            >
                                {({showModal}) => (
                                    <Button
                                        type="button"
                                        onClick={async () => {
                                            if (isLoggedIn) {
                                                showModal();
                                            } else {
                                                await router.push("/loggain");
                                            }
                                        }}
                                        data-testid="addWatcherButton"
                                    >
                                        Lägg till bevakning
                                    </Button>
                                )}
                            </ConfirmModal>
                        </div>
                    </footer>
                </Form>
            )}
        </Formik>
    );
};
