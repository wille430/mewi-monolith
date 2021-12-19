import { CategoryData } from "models/types"
import { Link } from "react-router-dom"
import { toSnakeCase } from "@mewi/util"

interface Props {
    categoryData: CategoryData,
    subCatIndex?: number,
    parentTo?: string
}

const CategoryListItem = ({ categoryData, subCatIndex = 0, parentTo = "/kategorier" }: Props) => {

    const redirectUrl = `${parentTo}/${toSnakeCase(categoryData.cat)}`

    return (
        <div>
            <Link to={redirectUrl} className={`${subCatIndex === 0 ? "text-lg font-bold" : ''}`}>{categoryData.cat}</Link>
            <div className="">
                {categoryData.subcat.map(subcat => <CategoryListItem categoryData={subcat} subCatIndex={subCatIndex + 1} parentTo={redirectUrl} />)}
            </div>
        </div >
    )
}

export default CategoryListItem