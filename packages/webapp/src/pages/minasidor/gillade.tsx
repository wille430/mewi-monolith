import { Role } from '@mewi/prisma'
import { ReactElement, useRef } from 'react'
import Head from 'next/head'
import { Listing } from '@mewi/prisma/index-browser'
import { Container, HorizontalLine } from '@mewi/ui'
import { useMutation } from 'react-query'
import axios from 'axios'
import { withAuth } from '@/lib/auth'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { serialize } from '@/lib/serialize'
import prisma from '@/lib/prisma'
import { ListingRow } from '@/components/ListingRow/ListingRow'
import { ListingPopUpContainer } from '@/components/ListingPopUp/ListingPopUp'
import { like, unlike } from '@/lib/listings'
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
    const likeMutation = useMutation((id: string) => axios.put(`/listings/${id}/like`), {
        onMutate: (id) => {
            _listings.current = like(id, user?.id, _listings.current)
        },
    })
    const unlikeMutation = useMutation((id: string) => axios.put(`/listings/${id}/unlike`), {
        onMutate: (id) => {
            _listings.current = unlike(id, user?.id, _listings.current)
        },
    })

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
                    <Container.Content className='space-y-4'>
                        {_listings.current.map((listing) => (
                            <ListingRow
                                key={listing.id}
                                listing={listing}
                                onLike={likeMutation.mutate}
                                onUnlike={unlikeMutation.mutate}
                            />
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
