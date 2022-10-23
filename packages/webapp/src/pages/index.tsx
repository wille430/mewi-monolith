import Head from 'next/head'
import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import { IListing, IUser } from '@wille430/common'
import dynamic from 'next/dynamic'
import { Layout } from '@/components/Layout/Layout'
import { Hero } from '@/components/Hero/Hero'
import { DecorativeWaves } from '@/components/DecorativeWaves/DecorativeWaves'
import { FeaturedListings } from '@/components/FeaturedListings/FeaturedListings'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { closeListing, setFeatured } from '@/store/listings'
import { wrapper } from '@/store'
import { dbConnection } from '@/lib/dbConnection'
import { serialize } from '@/lib/serialize'
import _ from 'lodash'

const ListingPopUp = dynamic(() => import('@/components/ListingPopUp/ListingPopUp'))

interface IndexPageProps {
    featuredListings: IListing[]
}

export const getStaticProps: GetStaticProps = wrapper.getStaticProps((store) => async () => {
    // Get random listings
    const db = await dbConnection()
    const listingsCollection = db.collection<IUser>('listings')
    const docCount = await listingsCollection.countDocuments({})
    let listings = await Promise.all(
        Array(8)
            .fill(null)
            .map(() =>
                listingsCollection.findOne(
                    {},
                    {
                        skip: Math.floor(Math.random() * (docCount - 1)),
                    }
                )
            )
    )
    listings = _.uniqBy(listings, (o) => o?._id)

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
