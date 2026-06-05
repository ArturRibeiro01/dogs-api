import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { apiErrorCodes, ApiErrorCode } from '../errors/api-error-code';
import { errorResponse } from '../responses/api-response';

type NestHttpErrorResponse = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
  code?: string;
  details?: unknown[];
};

const statusCodeToErrorCode: Partial<Record<number, ApiErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: apiErrorCodes.badRequest,
  [HttpStatus.UNAUTHORIZED]: apiErrorCodes.unauthorized,
  [HttpStatus.FORBIDDEN]: apiErrorCodes.forbidden,
  [HttpStatus.NOT_FOUND]: apiErrorCodes.notFound,
  [HttpStatus.CONFLICT]: apiErrorCodes.conflict,
  [HttpStatus.PAYLOAD_TOO_LARGE]: apiErrorCodes.payloadTooLarge,
  [HttpStatus.TOO_MANY_REQUESTS]: apiErrorCodes.tooManyRequests,
  [HttpStatus.INTERNAL_SERVER_ERROR]: apiErrorCodes.internalServerError,
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const publicError = this.toPublicError(exception, statusCode);

    if (statusCode >= 500) {
      this.logger.error(exception);
    }

    response
      .status(statusCode)
      .json(errorResponse(publicError.code, publicError.message, publicError.details));
  }

  private toPublicError(
    exception: unknown,
    statusCode: number,
  ): {
    code: string;
    message: string;
    details: unknown[];
  } {
    if (!(exception instanceof HttpException)) {
      return {
        code: apiErrorCodes.internalServerError,
        message: 'Ocorreu um erro inesperado.',
        details: [],
      };
    }

    const exceptionResponse = exception.getResponse();
    const body = this.normalizeExceptionResponse(exceptionResponse);

    if (this.isAppExceptionResponse(body)) {
      return {
        code: body.code,
        message: body.message,
        details: body.details ?? [],
      };
    }

    if (Array.isArray(body.message)) {
      return {
        code: apiErrorCodes.validationError,
        message: 'Revise os campos informados.',
        details: body.message,
      };
    }

    const code = statusCodeToErrorCode[statusCode] ?? apiErrorCodes.internalServerError;

    return {
      code,
      message: this.getSafeMessage(body.message, statusCode),
      details: this.getDetails(body.details),
    };
  }

  private normalizeExceptionResponse(response: string | object): NestHttpErrorResponse {
    if (typeof response === 'string') {
      return { message: response };
    }

    return response as NestHttpErrorResponse;
  }

  private isAppExceptionResponse(
    response: NestHttpErrorResponse,
  ): response is NestHttpErrorResponse & { code: string; message: string } {
    return typeof response.code === 'string' && typeof response.message === 'string';
  }

  private getSafeMessage(message: string | undefined, statusCode: number): string {
    if (statusCode >= 500) {
      return 'Ocorreu um erro inesperado.';
    }

    return message ?? 'Não foi possível processar a requisição.';
  }

  private getDetails(details: unknown): unknown[] {
    return Array.isArray(details) ? details : [];
  }
}
