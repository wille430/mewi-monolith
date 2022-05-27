import { Role } from '@mewi/prisma'
import { ReactElement } from 'react'
import Head from 'next/head'
import { Listing } from '@mewi/prisma/index-browser'
import { Container, HorizontalLine } from '@mewi/ui'
import { withAuth } from '@/lib/auth'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { serialize } from '@/lib/serialize'
import prisma from '@/lib/prisma'
import { ListingRow } from '@/components/ListingRow/ListingRow'
import { ListingPopUpContainer } from '@/components/ListingPopUp/ListingPopUp'

export const getServerSideProps = withAuth(
    async (req) => {
        const { id } = req.session.user

        const listings = await prisma.listing.findMany({
            where: {
                likedByUserIDs: {
                    has: id,
                },
            },
        })

        return {
            props: {
                listings: serialize(listings),
            },
        }
    },
    [Role.USER]
)

const Bevakningar = ({ listings }: { listings: Listing[] }) => {
    return (
        <>
            <Head>
                <title>Mina gillade | Mewi.se</title>
            </Head>
            <main>
                <Container>
                    <Container.Header>
                        <h3>Mina gillade produkter</h3>
                        <HorizontalLine />
                    </Container.Header>
                    <Container.Content className='space-y-4'>
                        {listings.map((listing) => (
                            <ListingRow key={listing.id} listing={listing} />
                        ))}
                    </Container.Content>
                </Container>
            </main>
            <ListingPopUpContainer />
        </>
    )
}

Bevakningar.getLayout = (page: ReactElement) => <MyAccountLayout>{page}</MyAccountLayout>

export default Bevakningar
