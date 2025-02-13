import {FunctionalityBlockInterface} from "../project/functionality-block.interface";

export interface PageFunctionalityBlockInterface {
  count: number;
  currentPage: number;
  items: Array<FunctionalityBlockInterface>;
  pageSize: number;
  skip: number;
  take: number;
  total: number;
  totalPages: number;
}
