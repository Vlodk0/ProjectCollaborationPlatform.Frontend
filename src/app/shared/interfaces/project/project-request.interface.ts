import {DeveloperInterface} from "../developer/developer.interface";

export interface ProjectRequestInterface {
  id: string;
  projectId: string;
  createdTimeStamp: string;
  developerId: string;
  developer: DeveloperInterface
}
