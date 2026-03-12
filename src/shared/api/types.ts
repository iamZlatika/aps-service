export type ApiError<T = unknown> = {
  message: string;
  status?: number;
  data?: T;
  name: "ApiError";
};

export type ValidationError = {
  message: string;
  errors: Record<string, string[]>;
};

export type ServerErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};
