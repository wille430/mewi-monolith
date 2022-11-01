import isString from 'lodash/isString'

export const parseSearchParamArray = (str: string | string[]) =>
    isString(str) ? str.split(',') : str
