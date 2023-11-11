import { NextApiRequest } from 'next';

export const paginate = (
  queryset: any,
  pageSize: number,
  pageNumber: number
) => {
  const count = queryset.count || 0;
  // check if exist next page
  const hasMore = pageNumber * pageSize < count;
  const hasPrev = pageNumber > 1 && pageNumber * pageSize <= count;

  const nextUrl =
    queryset.data.length === pageSize
      ? `/api/documents?page=${pageNumber + 1}&page_size=${pageSize}`
      : null;
  const prevUrl =
    pageNumber > 1
      ? `/api/documents?page=${pageNumber - 1}&pageSize=${pageSize}`
      : null;

  return {
    count: queryset.count,
    next: hasMore ? nextUrl : null,
    previous: hasPrev ? prevUrl : null,
    data: queryset.data
  };
};

export const getPagination = (req: NextApiRequest) => {
  const pageSize = req.query.page_size
    ? parseInt(req.query.page_size as string)
    : 10;
  const page = req.query.page ? parseInt(req.query.page as string) : 1;
  const query = req.query.query ? (req.query.query as string) : '';

  return {
    pageSize,
    page,
    query
  };
};
