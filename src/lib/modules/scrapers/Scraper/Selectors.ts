import isFunction from 'lodash/isFunction'
import { ElementHandle, Page } from 'puppeteer'

export type PropertySelectors<T> = {
    [K in keyof T]: T[K] extends Record<any, any>
        ? PropertySelectors<T[K]>
        : T[K] extends undefined
        ? undefined
        : string | ((ele: ElementHandle<Element>) => T[K])
}

export class Selectors<T> {
    private list: string
    private item: string
    private properties?: PropertySelectors<T>

    constructor(list: string, item: string, properties?: PropertySelectors<T>) {
        this.list = list
        this.item = item
        this.properties = properties
    }

    getList(page: Page): Promise<ElementHandle<Element> | null> {
        return page.$(this.list)
    }

    async getListElements(page: Page): Promise<ElementHandle<Element>[]> {
        const list = await this.getList(page)
        const eles = await list?.$$(this.item)

        return eles ?? []
    }

    async getProperty(ele: ElementHandle<Element>, property: keyof PropertySelectors<T>) {
        if (!this.properties) {
            throw new Error('Properties is undefined')
        }

        const f = this.properties[property]

        if (!f) {
            return undefined
        }

        if (isFunction(f)) {
            return f(ele)
        }

        return ele.$(f as string)
    }

    async getProperties(ele: ElementHandle<Element>) {
        if (!this.properties) {
            throw new Error('Properties is undefined')
        }

        const entity = {}

        for (const key of Object.keys(this.properties)) {
            entity[key] = await this.getProperty(ele, key as keyof PropertySelectors<T>)
        }

        return entity
    }
}
