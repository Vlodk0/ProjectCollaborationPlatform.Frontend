import {DeveloperTechnology} from "./developer-technology";

export interface PaginationDeveloper {
  id: string,
  firstName: string,
  lastName: string,
  technologies: DeveloperTechnology[]
}
