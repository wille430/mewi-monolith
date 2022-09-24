import _ from 'lodash'

export type ObjectWithMaybeCallback<T> = {
    [key in keyof T]: T[keyof T] | (() => T[keyof T])
}

export const createFactory = <T>(requiredAttrs: ObjectWithMaybeCallback<Partial<T>>) => {
    const mappedAttrs = _.map(Object.entries(requiredAttrs), ([key, value]) => {
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
            ...(_.fromPairs(mappedAttrs) as T),
            ...attrs,
        }
    }

    return {
        build: build,
    }
}
