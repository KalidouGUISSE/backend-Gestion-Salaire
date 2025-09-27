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
export declare function paginate<T>(model: any, // Prisma model instance
query: PaginationQuery, options?: {
    where?: any;
    include?: any;
    orderBy?: any;
}): Promise<PaginationResult<T>>;
//# sourceMappingURL=pagination.d.ts.map