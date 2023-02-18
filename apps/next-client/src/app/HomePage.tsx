"use client"
import {ListingDto, ListingSort} from "@mewi/models"
import {Hero} from "@/components/Hero/Hero"
import {DecorativeWaves} from "@/components/DecorativeWaves/DecorativeWaves"
import {DisplayListingsRow} from "@/components/DisplayListingsRow/DisplayListingsRow"

interface HomePageProps {
    featuredListings: ListingDto[],
    recentListings: ListingDto[]
}

// TODO: listing popup
export const HomePage = (props: HomePageProps) => {
    const {featuredListings, recentListings} = props
    return (
        <main>
            <section>
                <Hero/>
                <DecorativeWaves/>
            </section>

            <div className="space-y-12">
                <DisplayListingsRow title="Annonser i blickfånget" showMoreHref="/sok" listings={featuredListings}/>

                <DisplayListingsRow title="Senaste annonser" showMoreHref={`/sok?sort=${ListingSort.DATE_DESC}`}
                                    listings={recentListings}/>
            </div>

            <div className="h-32"/>
        </main>
    )
}