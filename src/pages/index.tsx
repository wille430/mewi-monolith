import Head from 'next/head'
import type { ReactElement } from 'react'
import type { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { Layout } from '@/lib/components/Layout/Layout'
import { Hero } from '@/lib/components/Hero/Hero'
import { DecorativeWaves } from '@/lib/components/DecorativeWaves/DecorativeWaves'
import { FeaturedListings } from '@/lib/components/FeaturedListings/FeaturedListings'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { closeListing, setFeatured } from '@/lib/store/listings'
import { wrapper } from '@/lib/store'
import { serialize } from '@/lib/utils/serialize'
import { IListing } from '@/common/schemas'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { ListingsService } from '@/lib/modules/listings/listings.service'

const ListingPopUp = dynamic(() => import('@/lib/components/ListingPopUp/ListingPopUp'))

interface IndexPageProps {
    featuredListings: IListing[]
}

export const getStaticProps: GetStaticProps = wrapper.getStaticProps((store) => async () => {
    const listingsServce = container.resolve(ListingsService)
    const listings = await listingsServce.sample(8)

    store.dispatch(setFeatured(serialize(listings)))

    return {
        props: {
            featuredListings: serialize(listings),
        } as IndexPageProps,
        revalidate: process.env.NODE_ENV === 'production' ? 15 * 60 * 60 : 1,
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
