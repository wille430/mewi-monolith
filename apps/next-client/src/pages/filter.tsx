import {useRouter} from 'next/router'
import {BasicLayout} from '@/lib/components/BasicLayout/BasicLayout'
import {Button} from '@/lib/components/Button/Button'
import {NextPageWithLayout} from '@/lib/types/next'
import {stringifySearchPath} from '@/lib/utils/url'
import {Container} from '@/lib/components/Container/Container'
import {ListingSearchForm} from '@/lib/components/ListingSearchForm/ListingSearchForm'
import {Form, Formik} from 'formik'
import {ListingSearchFilters} from '@/common/types'

const Filter: NextPageWithLayout = () => {
    const router = useRouter()

    const handleSubmit = (values: ListingSearchFilters) =>
        router.push(stringifySearchPath(values), undefined, {shallow: false})

    return (
        <>
            <aside></aside>
            <main>
                <Formik initialValues={{}} onSubmit={handleSubmit}>
                    <Container>
                        <Form>
                            <Container.Content className="grid gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
                                <ListingSearchForm/>
                            </Container.Content>
                            <Container.Footer className="flex justify-end space-x-2">
                                <Button label="Sök med filter" type="submit"/>
                            </Container.Footer>
                        </Form>
                    </Container>
                </Formik>
            </main>
            <aside></aside>
        </>
    )
}

Filter.getLayout = (component) => <BasicLayout>{component}</BasicLayout>

export default Filter
