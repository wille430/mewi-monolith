/* eslint-disable @next/next/no-img-element */
import { getColor, getTextColor } from "@mewi/utilities";
import {
  MjmlColumn,
  MjmlDivider,
  MjmlSection,
  MjmlTable,
  MjmlText,
} from "@faire/mjml-react";
import { Template } from "./components/Template";
import { ListingDto, WatcherMetadataDto } from "@mewi/models";
import { DefaultTemplateProps } from "./DefaultTemplateProps";
import { renderReactToMjml } from "../renderReactToMjml";

interface WatcherNotifyTemplateProps extends DefaultTemplateProps {
  listings: ListingDto[];
  filters: WatcherMetadataDto;
  listingCount: number;
}

export const WatcherNotifyTemplate = ({
  listings,
  filters,
  listingCount,
  clientUrl,
}: WatcherNotifyTemplateProps) =>
  renderReactToMjml(
    <Template>
      <MjmlSection backgroundColor="#EFEFEF">
        <MjmlColumn>
          <MjmlText align="center">
            <h1>Det finns {listingCount} nya annonser för din sökning!</h1>
          </MjmlText>
          <MjmlDivider borderWidth="1px"></MjmlDivider>
        </MjmlColumn>
      </MjmlSection>

      <MjmlSection backgroundColor="#EFEFEF">
        <MjmlColumn>
          <MjmlText align="center">
            <p>Filter: </p>

            {filters.keyword && <p>Sökord: {filters.keyword}</p>}

            {filters.categories && (
              <p>
                Kategorier:{" "}
                {new Intl.ListFormat("sv").format(filters.categories)}
              </p>
            )}
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>

      <MjmlSection backgroundColor="#EFEFEF">
        <MjmlColumn>
          <MjmlTable>
            <tr
              style={{
                color: "white",
                textAlign: "left",
              }}
            >
              <th>Produktnamn</th>
              <th>Sajt</th>
              <th>Länk</th>
            </tr>
            {listings.map((listing) => (
              <tr key={listing.id}>
                <td
                  style={{
                    height: "20px",
                  }}
                >
                  <img
                    width="100"
                    src={
                      listing.imageUrl[0] ??
                      new URL(
                        "/img/missingImage.png",
                        process.env.VERCEL_URL
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
                      textDecoration: "none",
                      borderRadius: 5,
                    }}
                  >
                    {listing.origin}
                  </span>
                </td>
                <td
                  style={{
                    textAlign: "right",
                  }}
                >
                  <a
                    style={{
                      backgroundColor: "#3dce5f",
                      color: "whitesmoke",
                      padding: 10,
                      textDecoration: "none",
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

      <MjmlSection backgroundColor="#EFEFEF" paddingBottom="42px">
        <MjmlColumn>
          <MjmlText align="center">
            <a href={new URL("/minasidor/bevakningar", clientUrl).toString()}>
              Gå till mina bevakningar
            </a>
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
    </Template>
  );
