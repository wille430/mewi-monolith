import { DecorativeWaves } from '@/components/DecorativeWaves/DecorativeWaves'
import { Hero } from '@/components/Hero/Hero'
import { Layout } from '@/components/Layout/Layout'
import Head from 'next/head'
import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import { Listing } from '@mewi/prisma/index-browser'
import FeaturedListings from '@/components/FeaturedListings/FeaturedListings'
import prisma from '@/lib/prisma'
import { useAppDispatch, useAppSelector } from '@/hooks'
import ListingPopUp from '@/components/ListingPopUp/ListingPopUp'
import { closeListing } from '@/store/listings'

interface IndexPageProps {
    featuredListings: Listing[]
}

export const getStaticProps: GetStaticProps = async () => {
    const listings = JSON.stringify(await prisma.listing.findMany({ take: 10 }))

    return {
        props: {
            featuredListings: JSON.parse(listings),
        } as IndexPageProps,
        revalidate: 15 * 60 * 60,
    }
}

const Index = ({ featuredListings }: IndexPageProps) => {
    const openedListing = useAppSelector((state) => state.listings.opened)
    const dispatch = useAppDispatch()

    return (
        <main>
            <Head>
                <title>Mewi.se - Sök efter beggagnade produkter på ett enda ställe</title>
            </Head>
            <section>
                <Hero />
                <DecorativeWaves />
            </section>
            <FeaturedListings listings={featuredListings} />
            <div className='h-32' />
            {openedListing && (
                <ListingPopUp
                    onClose={() => dispatch(closeListing())}
                    listing={openedListing}
                ></ListingPopUp>
            )}
        </main>
    )
}

Index.getLayout = (page: ReactElement) => <Layout decorations={false}>{page}</Layout>

export default Index
