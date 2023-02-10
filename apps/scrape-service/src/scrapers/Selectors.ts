import type {AnyNode, Cheerio, CheerioAPI} from 'cheerio'

export class Selectors<T> {
    private list: string
    private item: string

    constructor(list: string, item: string) {
        this.list = list
        this.item = item
    }

    getList($: CheerioAPI): Cheerio<any> {
        return $(this.list).first()
    }

    async getListElements($: CheerioAPI): Promise<AnyNode[]> {
        return $(`${this.list} > ${this.item}`).toArray()
    }
}
