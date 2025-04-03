import {ProjectStatusEnum} from "../../../core/enums/project-status.enum";
import {PaymentTypeEnum} from "../../../core/enums/payment-type.enum";

export interface ProjectFilterInterface {
  selectedTechnologies: string[];
  selectedFrameworks: string[];
  selectedPaymentTypes: PaymentTypeEnum[];
  selectedProjectStatuses: ProjectStatusEnum[];
}
