export interface BlocketListing {
  ad_id: string;
  ad_status: string;
  advertiser: {
    contact_methods: {
      email: string;
      phone: true;
      sms: true;
      name: string;
      type: "@/lib/store";
    };
  };
  body: string;
  category: {
    id: string;
    name:
      | "Fordon"
      | "Bilar"
      | "Båtar"
      | "Bildelar & biltillbehör"
      | "Mopeder"
      | "Båtdelar & tillbehör"
      | "Husvagnar & husbilar"
      | "MC-delar"
      | "A-traktor"
      | "Lastbil, truck & entreprenad"
      | "Motorcyklar"
      | "Snöskotrar"
      | "Snöskoterdelar"
      | "För hemmet"
      | "Bygg & trädgård"
      | "Husgeråd & vitvaror"
      | "Möbler & hemindredning"
      | "Verktyg"
      | "Bostad"
      | "Lägenheter"
      | "Villor"
      | "Radhus"
      | "Tomter"
      | "Gårdar"
      | "Fritidsboende"
      | "Utland"
      | "Personligt"
      | "Kläder & skor"
      | "Accessoarer & klockor"
      | "Barnartiklar & leksaker"
      | "Barnkläder & skor"
      | "Elektronik"
      | "Datorer & TV-spel"
      | "Ljud & bild"
      | "Telefoner & tillbehör"
      | "Fritid & hobby"
      | "Upplevelser & nöje"
      | "Böcker & studentlitteratur"
      | "Cyklar"
      | "Djur"
      | "Hobby & samlarprylar"
      | "Hästar & ridsport"
      | "Jakt & fiske"
      | "Musikutrustning"
      | "Sport- & fritidsutrustning"
      | "Affärsverksamhet"
      | "Affärsöverlåtelser"
      | "Inventarier & maskiner"
      | "Lokaler & fastigheter"
      | "Tjänster"
      | "Övrigt";
  }[];

  images: {
    height: number;
    type: "image";
    url: string;
    width: number;
  }[];

  infopage: {
    text: string;
    url: string;
  };
  list_id: string;
  list_time: string;
  location: {
    id: string;
    name: string;
    query_key: string;
  }[];
  map_url: string;
  parameter_groups?: {
    label: string;
    parameters: {
      id: string;
      label: string;
      value: string;
    }[];
    type: "general";
  }[];
  price: {
    label: "Pris";
    suffix: "kr";
    value: string;
    value_without_vat: number;
  };
  safety_tips: {
    id: string;
    short_text: string;
    subject: string;
    text: string;
    url: string;
  }[];
  share_url: string;
  state_id: string;
  subject: string;
  type: "s";
  zipcode: string;
}
