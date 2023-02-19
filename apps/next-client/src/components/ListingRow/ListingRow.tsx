"use client";
import DefaultImage from "@/components/DefaultImage/DefaultImage";
import { ListingDto } from "@mewi/models";
import { HTMLAttributes } from "react";

interface ListingRowProps extends HTMLAttributes<HTMLDivElement> {
  listing: ListingDto;
}

export const ListingRow = ({ listing, ...rest }: ListingRowProps) => {
  return (
    <article
      className="flex overflow-hidden gap-x-4 card p-0 hover:cursor-pointer hover:scale-[1.0025] pr-4 h-32"
      data-id={listing.id}
      {...rest}
    >
      <DefaultImage
        className="h-full h-auto object-cover"
        src={listing.imageUrl[0]}
        alt={listing.title}
      />

      <div className="py-2 flex flex-col flex-shrink flex-basis">
        <span>{listing.title}</span>
      </div>

      <div className="flex flex-col justify-between py-2 text-right w-56">
        <span className="text-muted">{listing.region}</span>

        {listing.price && (
          <span>
            {Intl.NumberFormat("sv-SE", {
              currency: listing.price.currency,
              style: "currency",
            }).format(listing.price.value)}
          </span>
        )}
      </div>
    </article>
  );
};
