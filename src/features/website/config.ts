export type ContactLocation = {
  address: string;
  areaKey: string;
  shortAddressKey: string;
  phone: string;
  phoneFormatted: string;
  mapsUrl: string;
};

// Hardcoded until server delivers contact data
export const CONTACTS: ContactLocation[] = [
  {
    address: "вул. Щаслива, 11",
    areaKey: "offices.office1.area",
    shortAddressKey: "offices.office1.street",
    phone: "+380612223344",
    phoneFormatted: "+380 (61) 222-33-44",
    mapsUrl: "https://maps.google.com/?q=вул.+Щаслива,+11,+Запоріжжя",
  },
  {
    address: "вул. Товариська, 58",
    areaKey: "offices.office2.area",
    shortAddressKey: "offices.office2.street",
    phone: "+380505556677",
    phoneFormatted: "+380 (50) 555-66-77",
    mapsUrl: "https://maps.google.com/?q=вул.+Товариська,+58,+Запоріжжя",
  },
];

export type MessengerKey = "telegram" | "viber" | "whatsapp";

export type MessengerConfig = {
  key: MessengerKey;
  href: string;
  hoverClass: string;
  colorClass: string;
};

export const MESSENGERS: MessengerConfig[] = [
  {
    key: "telegram",
    href: "https://t.me/apsservice",
    hoverClass: "ws-msg-tg",
    colorClass: "ws-msg-tg-color",
  },
  {
    key: "viber",
    href: "viber://chat?number=%2B380612223344",
    hoverClass: "ws-msg-vb",
    colorClass: "ws-msg-vb-color",
  },
  {
    key: "whatsapp",
    href: "https://wa.me/380612223344",
    hoverClass: "ws-msg-wa",
    colorClass: "ws-msg-wa-color",
  },
];
