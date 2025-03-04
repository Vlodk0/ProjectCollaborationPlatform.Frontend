import {AdminProjectOwnerDataInterface} from "./admin-project-owner-data.interface";

export interface PageAdminProjectOwnerDataInterface {
  count: number;
  currentPage: number;
  items: Array<AdminProjectOwnerDataInterface>;
  pageSize: number;
  skip: number;
  take: number;
  total: number;
  totalPages: number;
}
