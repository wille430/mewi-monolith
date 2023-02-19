"use client";
import {useRouter} from "next/navigation";
import {Button} from "@/components/Button/Button";
import {stringifySearchPath} from "@/lib/utils/url";
import {Container} from "@/components/Container/Container";
import {ListingSearchForm} from "@/components/ListingSearchForm/ListingSearchForm";
import {Form, Formik} from "formik";
import {ListingSearchFilters} from "@/common/types/ListingSearchFilters";

const Filter = () => {
    const router = useRouter();

    const handleSubmit = (values: ListingSearchFilters) =>
        router.push(stringifySearchPath(values));

    return (
        <main>
            <Formik initialValues={{}} onSubmit={handleSubmit}>
                <Container>
                    <Form>
                        <Container.Content className="grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
                            <ListingSearchForm/>
                        </Container.Content>
                        <Container.Footer className="flex justify-end space-x-2">
                            <Button type="submit">
                                Sök med filter
                            </Button>
                        </Container.Footer>
                    </Form>
                </Container>
            </Formik>
        </main>
    );
};

export default Filter;
