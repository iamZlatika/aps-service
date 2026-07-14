import { type STATUS_COLORS } from "@/shared/types";

export type OrderStatus = {
  id: number;
  key: string;
  nameRu: string;
  nameUa: string;
  color: (typeof STATUS_COLORS)[keyof typeof STATUS_COLORS];
  isSystem: boolean;
};
