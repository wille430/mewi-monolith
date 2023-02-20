"use client";
import differenceWith from "lodash/differenceWith";
import toPairs from "lodash/toPairs";
import flow from "lodash/flow";
import isEqual from "lodash/isEqual";
import fromPairs from "lodash/fromPairs";
import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { stringify } from "query-string";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ObjectSchema } from "yup";
import { useDebounce } from "@/hooks/useDebounce";
import { removeNullValues } from "@/lib/utils/removeNullValues";
import { searchParamsToObject } from "@mewi/utilities";
import every from "lodash/every";
import omit from "lodash/omit";
import {FormikProvider, useFormik} from "formik";

export type UseSearchOptions<T = Record<string, never>> = {
  defaultValue?: T;
  paginationKeys?: (keyof T)[];
};

const SearchContext = createContext<any>(null);

export const useSearchContext = <T extends Record<string, any>>(): ReturnType<
  typeof useSearch<T>
> => useContext(SearchContext);

const useSearch = <T extends Record<string, any>>(
  schema: ObjectSchema<any, any>,
  options: UseSearchOptions<T> = {}
) => {
  const { defaultValue, paginationKeys } = options;
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [hasParsedQuery, setHasParsedQuery] = useState(false);

  const objectDiff = useCallback((newFilters: T, oldFilters: T) => {
    return fromPairs(
      differenceWith(toPairs(newFilters), toPairs(oldFilters), isEqual)
    );
  }, []);

  const [filters, setFilters] = useState<T>(defaultValue ?? {} as any);

  /**
   * Debounced values
   */
  const [debouncedIsReady] = useDebounce(hasParsedQuery, 1000);
  const [debouncedFilters] = useDebounce(filters);

  const restoreFilters = (newFilters: T, oldFilters: T | null = null) => {
    const diff = objectDiff(newFilters, oldFilters ?? filters);

    if (
      paginationKeys != null &&
      // if any field changed is not a pagination field
      !every(Object.keys(diff), (k) => paginationKeys.includes(k))
    ) {
      newFilters = omit(newFilters, paginationKeys) as any;
    }
    return newFilters;
  };

  const castToSchema = useCallback(
    (obj: T) => schema.cast(obj, { stripUnknown: true }),
    [schema]
  );
  const parseQuery = (params: ReadonlyURLSearchParams | null): T =>
    params ? flow(searchParamsToObject, validateFilters)(params) : defaultValue;
  const validateFilters = (filters: T) =>
    flow(removeNullValues, castToSchema)(filters);

  const [updateFromParams, setUpdateFromParams] = useState(true);

  const updateParams = (filters: T) => {
    console.log("UPDATING PARAMS");
    router.push(pathname + "?" + stringify(validateFilters(filters)));
  };

  useEffect(() => {
    if (!hasParsedQuery) return;
    if (isEqual(parseQuery(params), filters)) return;

    updateParams(filters);
    setUpdateFromParams(false);
  }, [debouncedFilters]);

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

  return {
    filters: debouncedFilters,
    setFilters: flow(restoreFilters, setFilters),
    isReady: debouncedIsReady,
  };
};

type SearchProviderProps<T> = {
  children: ReactNode;
  schema: ObjectSchema<any, any>;
  options?: UseSearchOptions<T>;
};

export const SearchProvider = <T extends Record<any, any>>(props: SearchProviderProps<T>) => {
  const { children, schema, options = {} } = props;
  const value = useSearch<T>(schema, options);
  const {filters, setFilters} = value;

  const formik = useFormik({
    initialValues: options.defaultValue as T,
    onSubmit: (values) => {
      setFilters(values);
    }
  });

  useEffect(() => {
    if (isEqual(formik.values, filters)) return;
    console.log("UPDATING FILTERS");
    setFilters(formik.values);
  }, [formik.values]);

  useEffect(() => {
    if (isEqual(formik.values, filters)) return;
    console.log("UPDATING FORMIK");
    formik.setValues(filters);
  }, [filters]);

    return (
        <FormikProvider value={formik}>
            <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
        </FormikProvider>
    );
};
