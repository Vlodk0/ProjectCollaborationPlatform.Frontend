import {PaymentTypeEnum} from "../../../core/enums/payment-type.enum";
import {TimeDuration} from "../../../core/enums/time-duration.enum";

export interface UpdateProjectInterface {
  title: string;
  projectDetails: string;
  payment: number;
  paymentType: PaymentTypeEnum;
  timeDuration: TimeDuration;
  frameworkIds?: Array<string>;
  technologyIds?: Array<string>;
}
