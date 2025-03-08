export class Page<T> {
  count: number;
  currentPage: number;
  items: Array<T>;
  pageSize: number;
  skip: number;
  take: number;
  total: number;
  totalPages: number;
}
