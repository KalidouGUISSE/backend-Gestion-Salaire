export interface PaginationQuery {
  page?: number | undefined;
  limit?: number | undefined;
  cursor?: number | undefined;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page?: number;
    lastPage?: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextCursor?: number | null;
  };
}


export async function paginate<T>(
  model: any, // Prisma model instance
  query: PaginationQuery,
  options: {
    where?: any;
    include?: any;
    orderBy?: any;
  } = {}
): Promise<PaginationResult<T>> {
  const { page = 1, limit = 10, cursor } = query;

  if (cursor) {
    const data = await model.findMany({
      take: limit + 1,
      skip: 1,
      cursor: { id: cursor },
      where: options.where,
      include: options.include,
      orderBy: options.orderBy ?? { id: "desc" },
    });

    const hasNextPage = data.length > limit;
    return {
      data: hasNextPage ? data.slice(0, -1) : data,
      meta: {
        total: await model.count({ where: options.where }),
        hasNextPage,
        hasPrevPage: true,
        nextCursor: hasNextPage ? data[data.length - 1].id : null,
      },
    };
  }

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    model.findMany({
      skip,
      take: limit,
      where: options.where,
      include: options.include,
      orderBy: options.orderBy ?? { id: "desc" },
    }),
    model.count({ where: options.where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
}
