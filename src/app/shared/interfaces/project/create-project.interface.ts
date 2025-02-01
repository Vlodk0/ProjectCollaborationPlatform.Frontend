import {ProjectType} from "../../../core/enums/project-type.enum";
import {TimeDuration} from "../../../core/enums/time-duration.enum";

export interface CreateProjectInterface {
  title: string;
  projectDetails: string;
  payment: number;
  type: ProjectType;
  timeDuration: TimeDuration;
  frameworkIds?: Array<string>;
  technologyIds?: Array<string>;
}
