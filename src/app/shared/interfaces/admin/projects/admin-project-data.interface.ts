import {FrameworkInterface} from "../../project/framework.interface";
import {TechnologyInterface} from "../../project/technology.interface";
import {ProjectOwnerInterface} from "../../project/project-owner.interface";
import {ProjectType} from "../../../../core/enums/project-type.enum";
import {TimeDuration} from "../../../../core/enums/time-duration.enum";
import {ProjectStatusEnum} from "../../../../core/enums/project-status.enum";
import {PaymentTypeEnum} from "../../../../core/enums/payment-type.enum";

export interface AdminProjectDataInterface {
  id: string;
  title: string;
  payment: number;
  projectDetails: string;
  frameworks: Array<FrameworkInterface>;
  technologies: Array<TechnologyInterface>;
  projectOwner: ProjectOwnerInterface;
  type: ProjectType;
  timeDuration: TimeDuration;
  isFullTeam: boolean;
  createdTimeStamp: string;
  developerCount: number;
  technologiesCount: number
  frameworksCount: number;
  status: ProjectStatusEnum;
  paymentType: PaymentTypeEnum;
}
