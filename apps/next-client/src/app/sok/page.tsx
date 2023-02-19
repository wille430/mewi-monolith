"use client";
import {SearchSection} from "@/components/SearchSection/SearchSection";
import {SideFilters} from "@/components/SideFilters/SideFilters";
import {SearchProvider, useSearchContext} from "@/context/SearchContext";
import {searchListingsSchema} from "@/client/listings/schemas/search-listings.schema";
import clsx from "clsx";
import {TextField} from "@/components/TextField/TextField";
import {Field} from "formik";
import {ListingSearchFilters} from "@/common/types/ListingSearchFilters";
import React from "react";

const SearchPage = () => (
    <SearchProvider
        search={[
            searchListingsSchema,
            {
                defaultValue: {
                    page: 1
                },
                paginationKeys: ["page", "sort"]
            }
        ]}
    >
        <aside className="px-4 sm:px-0">
            <SideFilters/>
        </aside>
        <main className="container px-4">
            <KeywordTitle/>

            <Field
                as={TextField}
                showLabel={false}
                className={clsx("w-full max-w-sm border-2")}
                type="text"
                name="keyword"
                placeholder="Vad letar du efter?"
            />

            <SearchSection/>
        </main>
    </SearchProvider>
);


export default SearchPage;

const KeywordTitle = () => {
    const {filters} = useSearchContext<ListingSearchFilters>();
    return <h2 className="mb-2">Du sökte på "{filters.keyword}"</h2>;
};