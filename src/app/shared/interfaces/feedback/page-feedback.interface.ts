import {FeedbackInterface} from "./feedback.interface";

export interface PageFeedbackInterface {
  count: number;
  currentPage: number;
  items: Array<FeedbackInterface>;
  pageSize: number;
  skip: number;
  take: number;
  total: number;
  totalPages: number;
}
