export interface PaginationFilter {
  pageNumber: number;
  pageSize: number;
  sortColumn: string | string[];
  sortDirection: number;
}
