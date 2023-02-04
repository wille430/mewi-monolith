import type {ReactElement} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'
import {SearchSection} from '@/lib/components/SearchSection/SearchSection'
import {SideFilters} from '@/lib/components/SideFilters/SideFilters'
import {Layout} from '@/lib/components/Layout/Layout'
import {SearchProvider, useSearchContext} from '@/lib/hooks/useSearch'
import {searchListingsSchema} from '@/lib/client/listings/schemas/search-listings.schema'
import clsx from 'clsx'
import {TextField} from '@/lib/components/TextField/TextField'
import {Field} from 'formik'
import {ListingSearchFilters} from "@/common/types"
import React from "react"

const SearchPage = () => {
    const router = useRouter()

    return (
        <>
            <Head>
                <title>"{router.query.keyword ?? ' '}" | Mewi.se</title>
            </Head>

            <SearchProvider
                search={[
                    searchListingsSchema,
                    {
                        defaultValue: {
                            page: 1
                        }
                    }
                ]}
            >
                <aside>
                    <SideFilters/>
                </aside>
                <main>
                    <KeywordTitle/>

                    <KeywordInput/>

                    <SearchSection/>
                </main>
            </SearchProvider>
        </>
    )


}

SearchPage.getLayout = (component: ReactElement) => (
    <Layout>
        <div className="search-layout">{component}</div>
    </Layout>
)

export default SearchPage

const KeywordInput = () => {
    return (
        <Field
            as={TextField}
            showLabel={false}
            className={clsx('w-full max-w-sm border-2')}
            type="text"
            name="keyword"
            placeholder="Vad letar du efter?"
        />
    )
}

const KeywordTitle = () => {
    const {filters} = useSearchContext<ListingSearchFilters>()
    return <h2 className="mb-2">Du sökte på "{filters.keyword}"</h2>
}