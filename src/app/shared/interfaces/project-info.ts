import {DeveloperTechnology} from "./developer-technology";

export interface ProjectInfo {
  id: string,
  title: string,
  payment: number,
  description: string,
  technologies: DeveloperTechnology[]
  boardId: string
}
