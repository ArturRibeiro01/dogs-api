export type ApiItemResponse<TData> = {
  data: TData;
};

export type Pagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type ApiListResponse<TData> = {
  data: TData[];
  pagination: Pagination;
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details: unknown[];
  };
};

export function itemResponse<TData>(data: TData): ApiItemResponse<TData> {
  return { data };
}

export function listResponse<TData>(data: TData[], pagination: Pagination): ApiListResponse<TData> {
  return { data, pagination };
}

export function errorResponse(
  code: string,
  message: string,
  details: unknown[] = [],
): ApiErrorResponse {
  return {
    error: {
      code,
      message,
      details,
    },
  };
}
