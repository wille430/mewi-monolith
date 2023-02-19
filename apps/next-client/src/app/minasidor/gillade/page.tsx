import "reflect-metadata";
import { ListingRow } from "@/components/ListingRow/ListingRow";
import { UNAUTHORIZED_REDIRECT_TO } from "@/lib/constants/paths";
import { Container } from "@/components/Container/Container";
import { HorizontalLine } from "@/components/HorizontalLine/HorizontalLine";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getLikedListings } from "./getLikedListings";

const GilladePage = async () => {
  const listings = await getLikedListings();

  if (listings == null) {
    redirect(UNAUTHORIZED_REDIRECT_TO);
  }

  return (
    <main>
      <Container style={{ minHeight: "36rem" }}>
        <Container.Header>
          <h3>Mina gillade produkter</h3>
          <HorizontalLine />
        </Container.Header>
        <Container.Content className="flex flex-grow flex-col space-y-4">
          {listings?.length > 0 ? (
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
  );
};

export default GilladePage;
