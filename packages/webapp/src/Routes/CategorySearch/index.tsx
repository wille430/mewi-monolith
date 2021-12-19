import { Redirect, useParams } from "react-router"

interface ParamTypes {
    category_id: string,
    0?: string
}

const CategorySearch = () => {
    const params = useParams<ParamTypes>()
    return (
        <Redirect to={"/search?category=" + (params["0"]?.split('/')[params["0"].split('/').length - 1] || params.category_id)} />
    )
}

export default CategorySearch