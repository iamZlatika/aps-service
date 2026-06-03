export type PriceListCategory = {
  key: string;
  nameRu: string;
  nameUk: string;
};

export type PriceListItem = {
  id: number;
  category: PriceListCategory;
  nameRu: string;
  nameUk: string;
  price: number;
  priceNoteRu: string | null;
  priceNoteUk: string | null;
  sortOrder?: number;
};
