import UserAPI from "api/UserAPI"
import { WatcherMetadata } from "@mewi/types"
import { UserContext } from "common/context/UserContext"
import { ButtonHTMLAttributes, useContext, useState } from "react"
import { SearchParamsUtils } from "utils"
import { PriceRangeUtils } from "utils"
import { WatcherContext } from "Routes/Bevakningar/WatcherContext"
import AsyncButton from "common/components/AsyncButton"
import { FilterFormDataProps } from "."
import { APIError, DatabaseErrorCodes } from "@mewi/types"
import { SnackbarContext } from "common/context/SnackbarContext"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    formData: FilterFormDataProps,
    onClick?: () => void
}

const AddWatcherButton = ({ formData, onClick, ...rest }: Props) => {

    const { token } = useContext(UserContext)
    const { dispatch } = useContext(WatcherContext)
    const { setSnackbar } = useContext(SnackbarContext)

    const initState = {
        msg: null,
        color: "text-red-400"
    }
    const [responseMsg, setResponseMsg] = useState<any>(initState)

    // Hide message when user clicks
    document.getElementById('root')?.addEventListener("click", () => responseMsg.msg !== null && setResponseMsg(initState))

    // Add watcher
    const handleClick = async () => {
        console.log('Lägger till bevakning')


        const metadata: WatcherMetadata = {
            keyword: formData.keyword || '',
            regions: formData.regions.length >= 1 ? formData.regions : undefined,
            category: formData.category || undefined,
            isAuction: formData.isAuction,
            priceRange: (() => {
                let priceRange = {}

                Object.keys(formData.priceRange).forEach((key) => {

                    if (key !== 'gte' && key !== 'lte') return

                    if (formData.priceRange[key]) {
                        priceRange = {
                            ...priceRange,
                            [key]: formData.priceRange[key]
                        }
                    }

                })

                return priceRange
            })(),
        }

        const searchObj = new URLSearchParams([
            ['region', formData.regions.join(',')],
            ['category', formData.category],
            ['isAuction', formData.isAuction ? 'true' : 'false'],
            ['price', PriceRangeUtils.toString(formData.priceRange) || ""],
        ]).toString()

        const queryObj = SearchParamsUtils.searchToElasticQuery(searchObj).query
        queryObj.bool.must.push({ match: { title: metadata.keyword } })

        try {
            await UserAPI.addWatcher(token, queryObj, metadata).then(res => {
                dispatch({ type: 'add', newWatcher: res })
                setSnackbar({
                    title: 'Bevakning lades till',
                    body: 'Du kommer nu få notiser på mejlen när nya föremål som stämmer överens med filteret läggs till'
                })
            })
        } catch (e: any) {
            if (Boolean(e.error)) {
                switch (e.error.type) {
                    case DatabaseErrorCodes.CONFLICTING_RESOURCE:
                        setResponseMsg({
                            msg: "Bevakningen finns redan",
                            color: "text-red-400"
                        })
                        break
                    default:
                        setResponseMsg({
                            msg: "Ett fel inträffade",
                            color: "text-red-400"
                        })
                        break
                }
            } else {
                setResponseMsg({
                    msg: "Ett fel inträffade",
                    color: "text-red-400"
                })
            }
        }

        onClick && onClick()
    }

    return (
        <div>
            <AsyncButton
                {...rest}
                onClick={handleClick}
            >
                <span>Bevaka sökning</span>
            </AsyncButton>
            <span className={"text-sm pl-2 " + responseMsg.color}>{responseMsg.msg}</span>
        </div>
    )
}

export default AddWatcherButton