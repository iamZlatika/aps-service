export const GRANULARITIES = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
} as const;
export type Granularity = (typeof GRANULARITIES)[keyof typeof GRANULARITIES];

export type StatisticsFilters = {
  from: string;
  to: string;
  locationId: number | null;
};

export type RevenueStatistics = {
  payments: { total: string; cash: string; card: string; count: number };
  accrued: {
    turnover: string;
    margin: string;
    cost: string;
    paid: string;
    orders: number;
  };
  granularity: Granularity;
  series: { bucket: string; payments: string }[];
};

export type OrderStatusSnapshot = {
  key: string;
  name: string;
  color: string | null;
  count: number;
};

export type OrdersStatistics = {
  statusSnapshot: OrderStatusSnapshot[];
  new: number;
  closed: number;
  overdue: number;
  avgRepairDays: number | null;
};

export type TopStatistics = {
  manufacturers: { value: string; count: number }[];
  deviceTypes: { value: string; count: number }[];
  customers: {
    customerId: number;
    name: string;
    orders: number;
    turnover: string;
    profit: string;
  }[];
  locations: { id: number; name: string; orders: number; payments: string }[];
};

export type StaffRow = {
  userId: number;
  name: string;
  period: {
    closed: number;
    turnover: string;
    margin: string;
    earned: string;
    paidOut: string;
  };
  snapshot: { balance: string; available: string };
};

export type StaffStatistics = {
  rows: StaffRow[];
};
