import {DeveloperPositionEnum} from "../../../core/enums/developer-position.enum";

export interface DeveloperRequestInterface {
  searchTerm: string;
  countryCodes: string[];
  technologyIds: string[];
  frameworkIds: string[];
  positions: DeveloperPositionEnum[];
  from: number;
  to: number;
  currentPage: number;
  pageSize: number;
}
