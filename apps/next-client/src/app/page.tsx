import 'reflect-metadata'
import {container} from 'tsyringe'
import {ListingsService} from '@/lib/modules/listings/listings.service'
import {HomePage} from "@/app/HomePage"
import {Listing} from "@mewi/entities"
import {serialize} from "@/lib/utils/serialize"

const getFeaturedListings = () => container.resolve(ListingsService).getFeatured().then(o => o.map(Listing.convertToDto))
const getRecentListings = () => container.resolve(ListingsService).getRecent().then(o => o.map(Listing.convertToDto))

export const metadata = {
    title: "Mewi.se - Sök efter begagnade produkter på ett enda ställe",
    description: "Sök och hitta begagnade produkter på ett enda ställe",
    keywords: "Begagnat"
}

const Page = async () => {
    const featuredListings = await getFeaturedListings()
    const recentListings = await getRecentListings()

    return <HomePage featuredListings={serialize(featuredListings)} recentListings={serialize(recentListings)}/>
}


export default Page
