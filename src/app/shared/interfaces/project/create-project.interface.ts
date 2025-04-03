import {ProjectType} from "../../../core/enums/project-type.enum";
import {TimeDuration} from "../../../core/enums/time-duration.enum";
import {PaymentTypeEnum} from "../../../core/enums/payment-type.enum";

export interface CreateProjectInterface {
  title: string;
  projectDetails: string;
  payment: number;
  type: ProjectType;
  paymentType: PaymentTypeEnum;
  timeDuration: TimeDuration;
  frameworkIds?: Array<string>;
  technologyIds?: Array<string>;
}
