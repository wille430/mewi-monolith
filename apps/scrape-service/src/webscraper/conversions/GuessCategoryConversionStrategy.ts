import {Category} from "@mewi/models"
import {stringSimilarity} from "@mewi/utilities"
import {IConversionStrategy} from "./ConversionStrategy"

export class GuessCategoryConversionStrategy implements IConversionStrategy {
    stringToCategoryMap: Record<string, Category> = {}

    convert(_string: string): string {
        const string = _string.toUpperCase()
        if (this.stringToCategoryMap[string])
            return this.stringToCategoryMap[string]

        if (string in Category && Category[string as Category] != null)
            return string.toUpperCase() as Category

        for (const category of Object.values(Category)) {
            const similarity = stringSimilarity(category, string) * 2
            if (similarity >= 0.7) {
                this.stringToCategoryMap[string] = category as Category
                return category as Category
            }
        }

        this.stringToCategoryMap[string] = Category.OVRIGT
        return Category.OVRIGT
    }
}