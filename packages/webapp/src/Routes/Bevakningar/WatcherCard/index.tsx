import { Link } from "react-router-dom"
import { PriceRangeUtils } from "utils"
import { capitalize } from "@mewi/util"
import RemoveButton from "./RemoveWatcherButton"

const WatcherCard = ({ watcher }: { watcher: any }) => {

    const queryParams = [
        ['q', watcher.metadata.keyword],
        ['region', watcher.metadata.regions],
        ['category', watcher.metadata.category],
        ['isAuction', watcher.metadata.isAuction],
        ["price", PriceRangeUtils.toString(watcher.metadata.priceRange)]
    ]

    const linkUrl = '/search?' + queryParams.map(x => {
        if (!x[1]) return ''
        return `${x[0]}=${x[1]}`
    }).filter(x => x !== "").join('&')

    return (
        <article
            className="shadow-md rounded-md bg-white p-4 flex flex-col"
            data-testid="watcherCard"
        >
            {
                watcher.metadata.keyword && <header className="flex-none mb-4">
                    <label className="label">Sökord:</label>
                    <span>{watcher.metadata.keyword}</span>
                </header>
            }
            <div className="flex flex-grow space-y-4">
                <div className="grid grid-cols-fit-12 flex-1 gap-4">
                    {(watcher.metadata.regions && watcher.metadata.regions.length >= 1) ? <div className="mr-6">
                        <label className="label">Regioner:</label>
                        <span>{watcher.metadata.regions.map((x: string) => capitalize(x)).join(', ')}</span>
                    </div> : <div></div>}

                    {watcher.metadata.category ? <div className="mr-6">
                        <label className="label">Kategori:</label>
                        <span>{capitalize(watcher.metadata.category)}</span>
                    </div> : <div></div>}
                    {watcher.metadata.priceRange ? <div className="mr-6">
                        <label className="label">Prisintervall:</label>
                        <span>
                            {(watcher.metadata.priceRange.gte || '0') + "-" + (watcher.metadata.priceRange.lte ? (watcher.metadata.priceRange.lte + "kr") : "")}
                        </span>
                    </div> : <div></div>}
                    {watcher.metadata.isAuction ? <div className="mr-6">
                        <label className="label">Auktion:</label>
                        <span>{watcher.metadata.isAuction ? "Ja" : "Nej"}</span>
                    </div> : <div></div>}
                </div>
            </div>
            <footer className="flex items-center justify-between mt-2">
                <div className="text-sm opacity-70">
                    <label className="label">Lades till:</label>
                    <span>{new Date(watcher.createdAt).toLocaleDateString("se-SV")}</span>
                </div>
                <div className="flex space-x-2">
                    <Link className="button bg-blue px-4 text-white" to={linkUrl}>Sök</Link>
                    <RemoveButton watcherId={watcher._id} />
                </div>
            </footer>
        </article>
    )
}

export default WatcherCard