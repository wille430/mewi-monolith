// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import * as Formik from 'formik'

declare module 'formik' {
    export interface FormikErrors<T> {
        all?: string
    }
}
