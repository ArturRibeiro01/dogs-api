export const apiErrorCodes = {
  badRequest: 'BAD_REQUEST',
  validationError: 'VALIDATION_ERROR',
  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  notFound: 'NOT_FOUND',
  conflict: 'CONFLICT',
  payloadTooLarge: 'PAYLOAD_TOO_LARGE',
  tooManyRequests: 'TOO_MANY_REQUESTS',
  internalServerError: 'INTERNAL_SERVER_ERROR',
} as const;

export type ApiErrorCode = (typeof apiErrorCodes)[keyof typeof apiErrorCodes];
