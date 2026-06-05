import { HttpException, HttpStatus } from '@nestjs/common';

import { ApiErrorCode } from './api-error-code';

export type AppExceptionResponse = {
  code: ApiErrorCode;
  message: string;
  details?: unknown[];
};

export class AppException extends HttpException {
  constructor(
    code: ApiErrorCode,
    message: string,
    statusCode: HttpStatus,
    details: unknown[] = [],
  ) {
    super({ code, message, details } satisfies AppExceptionResponse, statusCode);
  }
}
