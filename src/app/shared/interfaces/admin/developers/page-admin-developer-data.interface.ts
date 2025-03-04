import {AdminDeveloperDataInterface} from "./admin-developer-data.interface";

export interface PageAdminDeveloperDataInterface {
  count: number;
  currentPage: number;
  items: Array<AdminDeveloperDataInterface>;
  pageSize: number;
  skip: number;
  take: number;
  total: number;
  totalPages: number;
}
