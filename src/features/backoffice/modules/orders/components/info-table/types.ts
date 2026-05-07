export type OrderItemInitialValues =
  | {
      name: string;
      price: string;
      quantity: number;
      managerId: number | undefined;
      purchasePrice: string;
      supplierName: string;
    }
  | {
      name: string;
      price: string;
      quantity: number;
      managerId: number | undefined;
      costPrice: string;
    };
