export type ValidationError = {
  message: string;
  errors: Record<string, string[]>;
};

export type ServerErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};
