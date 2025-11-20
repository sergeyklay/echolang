/**
 * Error thrown when validation fails in controllers or services.
 *
 * This error should be caught by controllers or middleware and mapped to
 * HTTP 400 Bad Request status code. The error message is safe to return
 * directly to clients and does not require sanitization.
 *
 * @example
 * ```ts
 * if (!isValid(input)) {
 *   throw new ValidationError('Invalid input provided');
 * }
 * ```
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

