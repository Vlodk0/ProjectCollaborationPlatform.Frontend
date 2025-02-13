import {DeveloperInterface} from "./developer.interface";

export interface PageDeveloperInterface {
  count: number;
  currentPage: number;
  items: Array<DeveloperInterface>;
  pageSize: number;
  skip: number;
  take: number;
  total: number;
  totalPages: number;
}
