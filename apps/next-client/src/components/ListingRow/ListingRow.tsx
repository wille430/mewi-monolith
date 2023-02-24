"use client";
import DefaultImage from "@/components/DefaultImage/DefaultImage";
import { ListingDto } from "@mewi/models";
import { HTMLAttributes } from "react";
import { ListingLikeButton } from "@/components/LikeButton/LikeButton";

interface ListingRowProps extends HTMLAttributes<HTMLDivElement> {
  listing: ListingDto;
}

export const ListingRow = ({ listing, ...rest }: ListingRowProps) => {
  return (
    <article
      className="relative flex overflow-hidden gap-x-4 card p-0 hover:cursor-pointer hover:scale-[1.0025] pr-4 h-32 group"
      data-id={listing.id}
      {...rest}
    >
      <DefaultImage
        className="h-full w-48 object-cover"
        src={listing.imageUrl[0]}
        alt={listing.title}
      />

      <div className="py-2 flex flex-col flex-grow">
        <span>{listing.title}</span>
      </div>

      <div className="flex flex-col justify-between py-2 text-right w-56">
        <span className="text-muted group-hover:opacity-0">
          {listing.region}
        </span>

        {listing.price && (
          <span>
            {Intl.NumberFormat("sv-SE", {
              currency: listing.price.currency,
              style: "currency",
            }).format(listing.price.value)}
          </span>
        )}
      </div>

      <div className="hidden group-hover:overlay group-hover:flex flex-row-reverse items-start p-2">
        <ListingLikeButton listing={listing} />
      </div>
    </article>
  );
};
