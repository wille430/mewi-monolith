import { DecorativeWaves } from '@/components/DecorativeWaves/DecorativeWaves'
import { Hero } from '@/components/Hero/Hero'
import { Layout } from '@/components/Layout/Layout'
import Head from 'next/head'
import { ReactElement } from 'react'
import { GetStaticProps } from 'next'
import { PrismaClient } from '@mewi/prisma'
import { Listing } from '@mewi/prisma/index-browser'
import FeaturedListings from '@/components/FeaturedListings/FeaturedListings'

interface IndexPageProps {
    featuredListings: Listing[]
}

export const getStaticProps: GetStaticProps = async () => {
    const prisma = new PrismaClient()
    const listings = JSON.stringify(await prisma.listing.findMany({ take: 10 }))

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

Index.getLayout = (page: ReactElement) => <Layout decorations={false}>{page}</Layout>

export default Index
