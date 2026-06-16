type LockedOrder = {
  id: string;
  device: string;
  status: string;
};

export const lockedOrders: LockedOrder[] = [
  { id: "APS-0000-000001", device: "Пристрій", status: "В роботі" },
  { id: "APS-0000-000002", device: "Пристрій", status: "Готово" },
];
