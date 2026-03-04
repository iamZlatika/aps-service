export type User = {
  id: number;
  name: string;
  email: string;
  role: "head_manager" | "user";
  status: "active" | "blocked";
};
