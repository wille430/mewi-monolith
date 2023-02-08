// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import * as Formik from '@/lib/types/formik'

declare module '@/lib/types/formik' {
    type FormikErrors<T> = {
        [K in keyof Values & { all?: string }]?: Values[K] extends any[]
            ? Values[K][number] extends object
                ? FormikErrors<Values[K][number]>[] | string | string[]
                : string | string[]
            : Values[K] extends object
            ? FormikErrors<Values[K]>
            : string
    }
}
