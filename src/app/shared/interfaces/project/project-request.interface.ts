import {DeveloperInterface} from "../developer/developer.interface";
import {ProjectInterface} from "./project.interface";

export interface ProjectRequestInterface {
  id: string;
  projectId: string;
  createdTimeStamp: string;
  developerId: string;
  developer: DeveloperInterface,
  project: ProjectInterface,
  projectOwnerId: string
}
