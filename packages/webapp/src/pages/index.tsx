import Head from 'next/head'
import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import { Listing } from '@mewi/prisma/index-browser'
import dynamic from 'next/dynamic'
import { Layout } from '@/components/Layout/Layout'
import { Hero } from '@/components/Hero/Hero'
import { DecorativeWaves } from '@/components/DecorativeWaves/DecorativeWaves'
import { FeaturedListings } from '@/components/FeaturedListings/FeaturedListings'
import prisma from '@/lib/prisma'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { closeListing, setFeatured } from '@/store/listings'
import { wrapper } from '@/store'
import { serialize } from '@/lib/serialize'

const ListingPopUp = dynamic(() => import('@/components/ListingPopUp/ListingPopUp'))

interface IndexPageProps {
    featuredListings: Listing[]
}

export const getStaticProps: GetStaticProps = wrapper.getStaticProps((store) => async () => {
    const listings = await prisma.listing.findMany({ take: 10 })

    store.dispatch(setFeatured(serialize(listings)))

    return {
        props: {
            featuredListings: serialize(listings),
        } as IndexPageProps,
        revalidate: 15 * 60 * 60,
    }
})

const Index = () => {
    const openedListing = useAppSelector((state) => state.listings.opened)
    const dispatch = useAppDispatch()

    return (
        <>
            <Head>
                <title>Mewi.se - Sök efter begagnade produkter på ett enda ställe</title>
                <meta
                    name='description'
                    content='Sök och hitta begagnade produkter på ett enda ställe'
                />
                <meta name='keywords' content='Begagnat' />
            </Head>

            <main>
                <section>
                    <Hero />
                    <DecorativeWaves />
                </section>
                <div className='p-4'>
                    <FeaturedListings />
                </div>
                <div className='h-32' />
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
