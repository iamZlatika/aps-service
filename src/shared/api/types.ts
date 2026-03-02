export type ApiError<T = unknown> = {
  message: string;
  status?: number;
  data?: T;
};

export type ValidationError = {
  message: string;
  errors: Record<string, string[]>;
};
