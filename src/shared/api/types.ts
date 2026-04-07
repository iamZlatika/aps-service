export type ValidationError = {
  message: string;
  errors: Record<string, string[]>;
};

export type ServerErrorResponse = Partial<ValidationError>;

export type PaginatedGetAllFn<
  TItem extends { id: number } = { id: number; [key: string]: unknown },
> = (
  page: number,
  perPage: number,
  sortColumn?: string | null,
  sortType?: "asc" | "desc" | "none",
  filters?: Record<string, string>,
) => Promise<{ items: TItem[] }>;
