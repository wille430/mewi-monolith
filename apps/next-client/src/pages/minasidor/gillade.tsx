import type { ReactElement } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { MyAccountLayout } from '@/lib/components/MyPagesLayout/MyPagesLayout'
import { ListingRow } from '@/lib/components/ListingRow/ListingRow'
import { ListingPopUpContainer } from '@/lib/components/ListingPopUp/ListingPopUpContainer'
import { useUser } from '@/lib/hooks/useUser'
import StyledLoader from '@/lib/components/StyledLoader'
import { ON_UNAUTHENTICATED_GOTO } from '@/lib/constants/paths'
import { Container } from '@/lib/components/Container/Container'
import { HorizontalLine } from '@/lib/components/HorizontalLine/HorizontalLine'
import useSWR from 'swr'
import { MY_LIKED_LISTINGS_KEY } from '@/lib/client/users/swr-keys'
import { getLikedListings } from '@/lib/client/user-watchers/queries'

const Gillade = () => {
    const { data: listings } = useSWR(MY_LIKED_LISTINGS_KEY, getLikedListings)
    const isLoading = !listings

    useUser({ redirectTo: ON_UNAUTHENTICATED_GOTO })

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
                    <Container.Content className='flex flex-grow flex-col space-y-4'>
                        {isLoading ? (
                            <div className='mx-auto my-auto'>
                                <StyledLoader />
                            </div>
                        ) : listings != null && listings.length > 0 ? (
                            listings.map((listing, i) => (
                                <ListingRow
                                    key={listing.id}
                                    data-testid={`listing-${i}`}
                                    listing={listing}
                                />
                            ))
                        ) : (
                            <div className='mb-16 flex flex-grow flex-col items-center justify-center text-sm '>
                                <span className='text-gray-400'>
                                    Du har inte gillat några produkter ännu
                                </span>
                                <div className='text-secondary underline'>
                                    <Link href='/apps/next-client/src/pages/sok'>Bläddra bland produkter här</Link>
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

Gillade.getLayout = (page: ReactElement) => <MyAccountLayout>{page}</MyAccountLayout>

export default Gillade
