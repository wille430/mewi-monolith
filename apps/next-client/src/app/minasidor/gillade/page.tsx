"use client"
import Link from 'next/link'
import {ListingRow} from '@/components/ListingRow/ListingRow'
import {useUser} from '@/hooks/useUser'
import StyledLoader from '@/components/StyledLoader'
import {UNAUTHORIZED_REDIRECT_TO} from '@/lib/constants/paths'
import {Container} from '@/components/Container/Container'
import {HorizontalLine} from '@/components/HorizontalLine/HorizontalLine'
import useSWR from 'swr'
import {MY_LIKED_LISTINGS_KEY} from '@/client/users/swr-keys'
import {getLikedListings} from '@/client/user-watchers/queries'

const Gillade = () => {
    const {data: listings} = useSWR(MY_LIKED_LISTINGS_KEY, getLikedListings)
    const isLoading = !listings

    useUser({redirectTo: UNAUTHORIZED_REDIRECT_TO})

    return (
        <main>
            <Container style={{minHeight: '36rem'}}>
                <Container.Header>
                    <h3>Mina gillade produkter</h3>
                    <HorizontalLine/>
                </Container.Header>
                <Container.Content className="flex flex-grow flex-col space-y-4">
                    {isLoading ? (
                        <div className="mx-auto my-auto">
                            <StyledLoader/>
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
                        <div className="mb-16 flex flex-grow flex-col items-center justify-center text-sm ">
                                <span className="text-gray-400">
                                    Du har inte gillat några produkter ännu
                                </span>
                            <div className="text-secondary underline">
                                <Link href="/sok">Bläddra bland produkter här</Link>
                            </div>
                        </div>
                    )}
                </Container.Content>
            </Container>
        </main>
    )
}

export default Gillade
