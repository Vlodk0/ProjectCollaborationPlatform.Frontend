import {DeveloperTechnology} from "./developer-technology";

export interface ProjectPagination {
  id: string,
  title: string;
  payment: number;
  description: string;
  shortInfo: string;
  technologies: DeveloperTechnology[]
}
