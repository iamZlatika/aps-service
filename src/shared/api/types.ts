export type ValidationError = {
  message: string;
  errors: Record<string, string[]>;
};

export type ServerErrorResponse = Partial<ValidationError>;
