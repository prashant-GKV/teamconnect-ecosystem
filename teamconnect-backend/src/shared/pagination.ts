import { PAGINATION } from "@teamconnect/shared-config";

export function parsePagination(query: Record<string, unknown>) {
  const page  = Math.max(1, Number(query["page"])  || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(PAGINATION.MAX_LIMIT, Math.max(1, Number(query["limit"]) || PAGINATION.DEFAULT_LIMIT));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildMeta(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
