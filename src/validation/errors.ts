import { ZodError } from 'zod';

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly zodError?: ZodError
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  public static fromZodError(zodError: ZodError): ValidationError {
    const errorMessages = zodError.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');

    return new ValidationError(`Validation failed: ${errorMessages}`, zodError);
  }
}
