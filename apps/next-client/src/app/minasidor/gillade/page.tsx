import "reflect-metadata";
import { ListingRow } from "@/components/ListingRow/ListingRow";
import { UNAUTHORIZED_REDIRECT_TO } from "@/lib/constants/paths";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getLikedListings } from "./getLikedListings";

const GilladePage = async () => {
  const listings = await getLikedListings();

  if (listings == null) {
    redirect(UNAUTHORIZED_REDIRECT_TO);
    return null;
  }

  return (
    <main>
      <section className="card" style={{ minHeight: "36rem" }}>
        <h3>Mina gillade produkter</h3>
        <hr />
        <div className="flex flex-grow flex-col space-y-4">
          {listings.length > 0 ? (
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
        </div>
      </section>
    </main>
  );
};

export default GilladePage;
