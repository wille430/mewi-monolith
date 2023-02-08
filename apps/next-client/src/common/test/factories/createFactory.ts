import fromPairs from 'lodash/fromPairs'
import map from 'lodash/map'

export type ObjectWithMaybeCallback<T> = {
    [key in keyof T]: T[keyof T] | (() => T[keyof T])
}

export const createFactory = <T>(requiredAttrs: ObjectWithMaybeCallback<Partial<T>>) => {
    const mappedAttrs = map(Object.entries(requiredAttrs), ([key, value]) => {
        let retVal
        if (typeof value === 'function') {
            retVal = value()
        } else {
            retVal = value
        }
        return [key, retVal]
    })

    const build = (attrs: Partial<T> = {}): T => {
        return {
            ...(fromPairs(mappedAttrs) as T),
            ...attrs,
        }
    }

    return {
        build: build,
    }
}
