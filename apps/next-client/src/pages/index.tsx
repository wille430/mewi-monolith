import Head from 'next/head'
import type {ReactElement} from 'react'
import type {GetStaticProps} from 'next'
import dynamic from 'next/dynamic'
import {Layout} from '@/components/Layout/Layout'
import {Hero} from '@/components/Hero/Hero'
import {DecorativeWaves} from '@/components/DecorativeWaves/DecorativeWaves'
import {DisplayListingsRow} from '@/components/DisplayListingsRow/DisplayListingsRow'
import {useAppDispatch, useAppSelector} from '@/hooks'
import {closeListing} from '@/store/listings'
import {serialize} from '@/lib/utils/serialize'
import 'reflect-metadata'
import {container} from 'tsyringe'
import {ListingsService} from '@/lib/modules/listings/listings.service'
import {ListingDto, ListingSort} from "@mewi/models"
import {Listing} from "@mewi/entities"

const ListingPopUp = dynamic(() => import('@/components/ListingPopUp/ListingPopUp'))

interface IndexPageProps {
    featuredListings: ListingDto[]
    newListings: ListingDto[]
}

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
    const listingsService = container.resolve(ListingsService)
    const featuredListings = await listingsService.getFeatured()
    const newListings = await listingsService.getRecent()

    return {
        props: {
            featuredListings: serialize(featuredListings.map(Listing.convertToDto)),
            newListings: serialize(newListings.map(Listing.convertToDto))
        },
        revalidate: process.env.NODE_ENV === 'production' ? 15 * 60 : 1,
    }
}

const Index = ({featuredListings, newListings}: IndexPageProps) => {
    const openedListing = useAppSelector((state) => state.listings.opened)
    const dispatch = useAppDispatch()

    return (
        <>
            <Head>
                <title>Mewi.se - Sök efter begagnade produkter på ett enda ställe</title>
                <meta
                    name="description"
                    content="Sök och hitta begagnade produkter på ett enda ställe"
                />
                <meta name="keywords" content="Begagnat"/>
            </Head>

            <main>
                <section>
                    <Hero/>
                    <DecorativeWaves/>
                </section>

                <div className="space-y-12">
                    <DisplayListingsRow title="Annonser i blickfånget" showMoreHref="/sok" listings={featuredListings}/>

                    <DisplayListingsRow title="Senaste annonser" showMoreHref={`/sok?sort=${ListingSort.DATE_DESC}`}
                                        listings={newListings}/>
                </div>

                <div className="h-32"/>
                {openedListing && (
                    <ListingPopUp
                        onClose={() => dispatch(closeListing())}
                        listing={openedListing}
                    ></ListingPopUp>
                )}
            </main>
        </>
    )
}

Index.getLayout = (page: ReactElement) => <Layout decorations={false}>{page}</Layout>

export default Index
