import { Role } from '@mewi/prisma'
import { ReactElement, useRef } from 'react'
import Head from 'next/head'
import { Listing } from '@mewi/prisma/index-browser'
import { Container, HorizontalLine } from '@wille430/ui'
import Link from 'next/link'
import { withAuth } from '@/lib/auth'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { serialize } from '@/lib/serialize'
import prisma from '@/lib/prisma'
import { ListingRow } from '@/components/ListingRow/ListingRow'
import { ListingPopUpContainer } from '@/components/ListingPopUp/ListingPopUp'
import { useAppSelector } from '@/hooks'

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
    const _listings = useRef(listings)

    const { user } = useAppSelector((state) => state.user)

    return (
        <>
            <Head>
                <title>Mina gillade | Mewi.se</title>
            </Head>
            <main>
                <Container style={{ minHeight: '36rem' }}>
                    <Container.Header>
                        <h3>Mina gillade produkter</h3>
                        <HorizontalLine />
                    </Container.Header>
                    <Container.Content className='space-y-4 flex flex-col flex-grow'>
                        {_listings.current.map((listing, i) => (
                            <ListingRow
                                key={listing.id}
                                data-testid={`listing-${i}`}
                                listing={listing}
                            />
                        ))}

                        {!_listings.current.length && (
                            <div className='flex flex-col justify-center items-center flex-grow mb-16 text-sm '>
                                <span className='text-gray-400'>
                                    Du har inte gillat några produkter ännu.
                                </span>
                                <div className='text-secondary underline'>
                                    <Link href='/sok'>Bläddra bland produkter här</Link>
                                </div>
                            </div>
                        )}
                    </Container.Content>
                </Container>
            </main>
            <ListingPopUpContainer />
        </>
    )
}

Bevakningar.getLayout = (page: ReactElement) => <MyAccountLayout>{page}</MyAccountLayout>

export default Bevakningar
