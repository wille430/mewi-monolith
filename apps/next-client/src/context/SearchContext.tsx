"use client";
import differenceWith from "lodash/differenceWith";
import toPairs from "lodash/toPairs";
import flow from "lodash/flow";
import isEqual from "lodash/isEqual";
import fromPairs from "lodash/fromPairs";
import {ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams} from "next/navigation";
import {stringify} from "query-string";
import {createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState} from "react";
import {ObjectSchema} from "yup";
import {useDebounce} from "@/hooks/useDebounce";
import {FormikProvider, useFormik} from "formik";
import noop from "lodash/noop";
import {removeNullValues} from "@/lib/utils/removeNullValues";
import {searchParamsToObject} from "@mewi/utilities";
import every from "lodash/every";
import omit from "lodash/omit";

export type UseSearchOptions<T = Record<string, never>> = {
    exclude?: Partial<T>
    defaultValue?: Partial<T>
    paginationKeys?: (keyof T)[]
}

const SearchContext = createContext<any>(null);

export const useSearchContext = <T extends Record<string, any>>(): ReturnType<
    typeof useSearch<T>
> => useContext(SearchContext);

const useSearch = <T extends Record<string, any>>(
    schema: ObjectSchema<any, any>,
    options: UseSearchOptions<T> = {}
) => {
    const {defaultValue, paginationKeys} = options;
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [hasParsedQuery, setHasParsedQuery] = useState(false);


    const objectDiff = useCallback((newFilters: T, oldFilters: T) => {
        return fromPairs(differenceWith(toPairs(newFilters), toPairs(oldFilters), isEqual));
    }, []);

    const restoreFilters = (newFilters: T, oldFilters: T | null = null) => {
        const diff = objectDiff(newFilters, oldFilters ?? filters);

        if (paginationKeys != null &&
            // if any field changed is not a pagination field
            !every(Object.keys(diff), k => paginationKeys.includes(k))
        ) {
            newFilters = omit(newFilters, paginationKeys) as any;
        }
        return newFilters;
    };

    const formik = useFormik<T>({
        initialValues: (defaultValue ?? {}) as T,
        onSubmit: noop
    });
    const {values: filters, setValues: setFilters} = formik;

    const castToSchema = useCallback((obj: T) => schema.cast(obj, {stripUnknown: true}), [schema]);
    const parseQuery = (params: ReadonlyURLSearchParams | null): T => params ? flow(searchParamsToObject, validateFilters)(params) : defaultValue;
    const validateFilters = (filters: T) => flow(removeNullValues, castToSchema)(filters);

    const [updateFromParams, setUpdateFromParams] = useState(true);

    const updateParams = (filters: T) => {
        router.push(pathname + "?" + stringify(validateFilters(filters)));
    };

    const oldFilters = useRef<T>(filters);
    useEffect(() => {
        if (!hasParsedQuery) return;
        if (isEqual(parseQuery(params), filters)) return;
        const restoredFilters = restoreFilters(filters, oldFilters.current);
        if (!isEqual(restoredFilters, filters)) {
            setFilters(restoredFilters);
            return;
        }

        oldFilters.current = filters;
        updateParams(filters);
        setUpdateFromParams(false);
    }, [filters]);

    // Get filters from query
    useEffect(() => {
        if (!updateFromParams) {
            setUpdateFromParams(true);
            return;
        }
        const parsed = parseQuery(params);
        if (isEqual(parsed, filters)) return;

        params && setFilters(parseQuery(params));
        setHasParsedQuery(true);
    }, [params]);

    /**
     * Debounced values
     */
    const [debouncedIsReady] = useDebounce(hasParsedQuery, 1000);
    const [debouncedFilters] = useDebounce(filters);

    return {
        formik,
        filters: debouncedFilters,
        setFilters: flow(restoreFilters, setFilters),
        isReady: debouncedIsReady
    };
};

type SearchProviderProps = {
    children: ReactNode
    search: Parameters<typeof useSearch>
}

export const SearchProvider = (props: SearchProviderProps) => {
    const {children, search} = props;
    const value = useSearch(...search);

    return (
        <FormikProvider value={value.formik}>
            <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
        </FormikProvider>
    );
};
