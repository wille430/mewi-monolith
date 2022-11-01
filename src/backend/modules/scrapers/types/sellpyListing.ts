export interface SellpyListing {
  createdAt: number;
  updatedAt: number;
  user: string;
  weight: number;
  itemPackaging: string;
  metadata: {
    brand: string;
    demography: string;
    size: string;
    type: string;
    condition: string;
    material: string[];
    color: string[];
  };
  images: string[];
  salesChannel: string;
  sizes: string[];
  cat1: string;
  cat2: string;
  cat3: string;
  p2p: boolean;
  isReserved: boolean;
  featuredIn: string[];
  segment: string;
  itemIO: string;
  estimateBid_rounded: number;
  categories: {
    lvl0: string[];
    lvl1: string[];
    lvl2: string[];
    lvl3: string[];
  };
  pricing: {
    amount: number;
    currency: "SEK";
  };
  isForSale: boolean;
  saleStartedAt: number;
  price_SE: {
    amount: number;
    currency: "SEK";
  };
  lastChance: boolean;
  favouriteCount: number;
  favoriteCountBucket: number;
  objectID: string;
  // "_highlightResult": {
  //     "user": {
  //         "value": string,
  //         "matchLevel": string,
  //         "matchedWords": []
  //     },
  //     "metadata": {
  //         "brand": {
  //             "value": "Filippa K",
  //             "matchLevel": "none",
  //             "matchedWords": []
  //         },
  //         "demography": {
  //             "value": "Kvinna",
  //             "matchLevel": "none",
  //             "matchedWords": []
  //         },
  //         "size": {
  //             "value": "WMN-INT-L",
  //             "matchLevel": "none",
  //             "matchedWords": []
  //         },
  //         "type": {
  //             "value": "Polotröja",
  //             "matchLevel": "none",
  //             "matchedWords": []
  //         },
  //         "material": [{
  //             "value": "Bomull",
  //             "matchLevel": "none",
  //             "matchedWords": []
  //         }],
  //         "color": [{
  //             "value": "Blå",
  //             "matchLevel": "none",
  //             "matchedWords": []
  //         }]
  //     },
  //     "sizes": [{
  //         "value": "WMN-INT-L",
  //         "matchLevel": "none",
  //         "matchedWords": []
  //     }],
  //     "cat2": {
  //         "value": "Kläder > Damkläder",
  //         "matchLevel": "none",
  //         "matchedWords": []
  //     },
  //     "featuredIn": [{
  //         "value": "UmEBwGxWA8",
  //         "matchLevel": "none",
  //         "matchedWords": []
  //     }
  //     ]
  // }
}
