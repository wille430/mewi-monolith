import type { IListing } from '@wille430/common'
import type { ReactElement } from 'react'
import Head from 'next/head'
import { Container, HorizontalLine } from '@wille430/ui'
import Link from 'next/link'
import { useQuery } from 'react-query'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { ListingRow } from '@/components/ListingRow/ListingRow'
import { ListingPopUpContainer } from '@/components/ListingPopUp/ListingPopUpContainer'
import { useUser } from '@/hooks/useUser'
import { instance } from '@/lib/axios'
import StyledLoader from '@/components/StyledLoader'
import { ON_UNAUTHENTICATED_GOTO } from '@/constants/paths'

const Gillade = () => {
    const { data: listings, isLoading } = useQuery('liked-listings', () =>
        instance.get<IListing[]>('/users/me/likes').then((res) => res.data)
    )

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

Gillade.getLayout = (page: ReactElement) => <MyAccountLayout>{page}</MyAccountLayout>

export default Gillade
