import {ProjectInterface} from "./project.interface";

export interface PageProjectInterface {
  count: number;
  currentPage: number;
  items: Array<ProjectInterface>;
  pageSize: number;
  skip: number;
  take: number;
  total: number;
  totalPages: number;
}
