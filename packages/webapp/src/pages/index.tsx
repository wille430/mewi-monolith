import { DecorativeWaves } from 'components/DecorativeWaves/DecorativeWaves'
import { Hero } from 'components/Hero/Hero'
import { Layout } from 'components/Layout/Layout'
import Head from 'next/head'
import { ReactElement } from 'react'
import FeaturedListings from 'old/Routes/Home/FeaturedListings/FeaturedListings'
import { GetStaticProps } from 'next'
import { Listing, PrismaClient } from '@prisma/client'

interface IndexPageProps {
    featuredListings: Listing[]
}

export const getStaticProps: GetStaticProps = async () => {
    const prisma = new PrismaClient()
    const listings = JSON.stringify(await prisma.listing.findMany({ take: 5 }))

    return {
        props: {
            featuredListings: JSON.parse(listings),
        } as IndexPageProps,
        revalidate: 15 * 60 * 60,
    }
}

const Index = ({ featuredListings }: IndexPageProps) => {
    return (
        <>
            <Head>
                <title>Mewi.se - Sök efter beggagnade produkter på ett enda ställe</title>
            </Head>
            <section>
                <Hero />
                <DecorativeWaves />
            </section>
            <FeaturedListings listings={featuredListings} />
            <div className='h-32' />
        </>
    )
}

Index.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export default Index
