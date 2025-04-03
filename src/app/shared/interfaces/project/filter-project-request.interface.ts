import {PaymentTypeEnum} from "../../../core/enums/payment-type.enum";
import {ProjectStatusEnum} from "../../../core/enums/project-status.enum";

export interface FilterProjectRequestInterface {
  technologyIds: string[];
  frameworkIds: string[];
  paymentTypes: PaymentTypeEnum[];
  projectStatuses: ProjectStatusEnum[];
  currentPage: number;
  searchTerm: string;
  pageSize: number;
}
