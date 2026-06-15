import { errorResponse, itemResponse, listResponse } from './api-response';

describe('api response helpers', () => {
  it('creates item responses', () => {
    expect(itemResponse({ id: '1' })).toEqual({
      data: { id: '1' },
    });
  });

  it('creates list responses with pagination', () => {
    expect(
      listResponse([{ id: '1' }], {
        page: 1,
        perPage: 12,
        total: 1,
        totalPages: 1,
      }),
    ).toEqual({
      data: [{ id: '1' }],
      pagination: {
        page: 1,
        perPage: 12,
        total: 1,
        totalPages: 1,
      },
    });
  });

  it('creates error responses', () => {
    expect(errorResponse('VALIDATION_ERROR', 'Revise os campos informados.', ['name'])).toEqual({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Revise os campos informados.',
        details: ['name'],
      },
    });
  });
});
