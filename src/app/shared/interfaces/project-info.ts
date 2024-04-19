import {DeveloperTechnology} from "./developer-technology";
import {CreateDeveloper} from "./create-developer";

export interface ProjectInfo {
  id: string,
  title: string,
  payment: number,
  description: string,
  technologies: DeveloperTechnology[]
  boardId: string,
  developers: CreateDeveloper[],
}
