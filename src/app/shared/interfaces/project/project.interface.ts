import {DeveloperInterface} from "../developer/developer.interface";
import {FrameworkInterface} from "./framework.interface";
import {TechnologyInterface} from "./technology.interface";
import {ProjectOwnerInterface} from "./project-owner.interface";
import {ProjectType} from "../../../core/enums/project-type.enum";
import {TimeDuration} from "../../../core/enums/time-duration.enum";
import {FunctionalityBlockInterface} from "./functionality-block.interface";

export interface ProjectInterface {
  id: string;
  title: string;
  payment: number;
  projectDetails: string;
  developers: Array<DeveloperInterface>;
  frameworks: Array<FrameworkInterface>;
  technologies: Array<TechnologyInterface>;
  projectOwner: ProjectOwnerInterface;
  type: ProjectType;
  timeDuration: TimeDuration;
  isFullTeam: boolean;
  projectTasks: Array<FunctionalityBlockInterface>;
  createdTimeStamp: string;
}
