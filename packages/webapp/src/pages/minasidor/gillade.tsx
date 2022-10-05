import { IUser } from '@wille430/common'
import { ReactElement } from 'react'
import Head from 'next/head'
import { Container, HorizontalLine } from '@wille430/ui'
import Link from 'next/link'
import { MyAccountLayout } from '@/components/MyPagesLayout/MyPagesLayout'
import { ListingRow } from '@/components/ListingRow/ListingRow'
import { ListingPopUpContainer } from '@/components/ListingPopUp/ListingPopUpContainer'
import { useUser } from '@/hooks/useUser'
import { useQuery } from 'react-query'
import { instance } from '@/lib/axios'
import StyledLoader from '@/components/StyledLoader'

const Bevakningar = () => {
    const { data: listings, isLoading } = useQuery('liked-listings', () =>
        instance.get<IUser>('/users/me').then((res) => res.data.likedListings)
    )

    useUser({ redirectTo: '/loggain' })

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
                            <StyledLoader />
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
