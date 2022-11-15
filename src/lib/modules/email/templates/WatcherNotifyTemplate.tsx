/* eslint-disable @next/next/no-img-element */
import { getColor, getTextColor } from '@/lib/constants/OriginColors'
import { MjmlColumn, MjmlDivider, MjmlSection, MjmlTable, MjmlText, render } from 'mjml-react'
import { WatcherMetadata } from '../../schemas/class/WatcherMetadata'
import { Listing } from '../../schemas/listing.schema'
import { Template } from './components/Template'

type WatcherNotifyTemplateProps = {
    listings: Listing[]
    filters: WatcherMetadata
    listingCount: number
}

export const WatcherNotifyTemplate = ({
    listings,
    filters,
    listingCount,
}: WatcherNotifyTemplateProps) =>
    render(
        <Template>
            <MjmlSection backgroundColor='#EFEFEF'>
                <MjmlColumn>
                    <MjmlText align='center'>
                        <h1>Det finns {listingCount} nya annonser för din sökning!</h1>
                    </MjmlText>
                    <MjmlDivider borderWidth='1px'></MjmlDivider>
                </MjmlColumn>
            </MjmlSection>

            <MjmlSection backgroundColor='#EFEFEF'>
                <MjmlColumn>
                    <MjmlText align='center'>
                        <p>Filter: </p>

                        {filters.keyword && <p>Sökord: {filters.keyword}</p>}

                        {filters.categories && (
                            <p>
                                Kategorier: {new Intl.ListFormat('sv').format(filters.categories)}
                            </p>
                        )}
                    </MjmlText>
                </MjmlColumn>
            </MjmlSection>

            <MjmlSection backgroundColor='#EFEFEF'>
                <MjmlColumn>
                    <MjmlTable>
                        <tr
                            style={{
                                color: 'white',
                                textAlign: 'left',
                            }}
                        >
                            <th>Produktnamn</th>
                            <th>Sajt</th>
                            <th>Länk</th>
                        </tr>
                        {listings.map((listing) => (
                            <tr>
                                <td
                                    style={{
                                        height: '20px',
                                    }}
                                >
                                    <img
                                        width='100'
                                        src={
                                            listing.imageUrl[0] ??
                                            new URL(
                                                '/img/missingImage.png',
                                                process.env.CLIENT_URL
                                            ).toString()
                                        }
                                    />
                                </td>
                                <td>{listing.title}</td>
                                <td
                                    style={{
                                        color: getColor(listing.origin),
                                    }}
                                >
                                    <span
                                        style={{
                                            background: getTextColor(listing.origin),
                                            padding: 10,
                                            textDecoration: 'none',
                                            borderRadius: 5,
                                        }}
                                    >
                                        {listing.origin}
                                    </span>
                                </td>
                                <td
                                    style={{
                                        textAlign: 'right',
                                    }}
                                >
                                    <a
                                        style={{
                                            backgroundColor: '#3dce5f',
                                            color: 'whitesmoke',
                                            padding: 10,
                                            textDecoration: 'none',
                                            borderRadius: 5,
                                        }}
                                        href={listing.redirectUrl}
                                    >
                                        Gå till annonsen
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </MjmlTable>
                </MjmlColumn>
            </MjmlSection>

            <MjmlSection backgroundColor='#EFEFEF' paddingBottom='42px'>
                <MjmlColumn>
                    <MjmlText align='center'>
                        <a
                            href={new URL(
                                '/minasidor/bevakningar',
                                process.env.CLIENT_URL
                            ).toString()}
                        >
                            Gå till mina bevakningar
                        </a>
                    </MjmlText>
                </MjmlColumn>
            </MjmlSection>
        </Template>,
        {
            validationLevel: 'soft',
        }
    )
