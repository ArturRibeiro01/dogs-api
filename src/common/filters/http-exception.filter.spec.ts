import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { AppException } from '../errors/app.exception';
import { apiErrorCodes } from '../errors/api-error-code';
import { HttpExceptionFilter } from './http-exception.filter';

type MockResponse = {
  status: jest.Mock<MockResponse, [number]>;
  json: jest.Mock<void, [unknown]>;
};

function createHost(response: MockResponse) {
  return {
    switchToHttp: () => ({
      getResponse: () => response,
    }),
  };
}

function createResponse(): MockResponse {
  const response: MockResponse = {
    status: jest.fn<MockResponse, [number]>(),
    json: jest.fn<void, [unknown]>(),
  };

  response.status.mockReturnValue(response);

  return response;
}

describe('HttpExceptionFilter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats validation errors', () => {
    const filter = new HttpExceptionFilter();
    const response = createResponse();

    filter.catch(
      new BadRequestException(['name must not be empty']),
      createHost(response) as never,
    );

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Revise os campos informados.',
        details: ['name must not be empty'],
      },
    });
  });

  it('formats standard http errors', () => {
    const filter = new HttpExceptionFilter();
    const response = createResponse();

    filter.catch(new NotFoundException('Recurso não encontrado.'), createHost(response) as never);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: 'NOT_FOUND',
        message: 'Recurso não encontrado.',
        details: [],
      },
    });
  });

  it('keeps app exception codes stable', () => {
    const filter = new HttpExceptionFilter();
    const response = createResponse();

    filter.catch(
      new AppException(apiErrorCodes.conflict, 'Username indisponível.', HttpStatus.CONFLICT),
      createHost(response) as never,
    );

    expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: 'CONFLICT',
        message: 'Username indisponível.',
        details: [],
      },
    });
  });

  it('hides internal error details', () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();

    const filter = new HttpExceptionFilter();
    const response = createResponse();

    filter.catch(
      new InternalServerErrorException('internal stack details'),
      createHost(response) as never,
    );

    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ocorreu um erro inesperado.',
        details: [],
      },
    });
  });
});
