import {ProjectSortClauseEnum} from "../../../../core/enums/admin/project-sort-clause.enum";
import {ProjectType} from "../../../../core/enums/project-type.enum";
import {TimeDuration} from "../../../../core/enums/time-duration.enum";

export interface AdminGetProjectsRequestInterface {
  searchTerm: string;
  countryCodes: string[];
  projectTypes: ProjectType[];
  projectTimeDurations: TimeDuration[];
  currentPage: number;
  pageSize: number;
  sortByProperty: ProjectSortClauseEnum;
  sortOrder: 'asc' | 'desc';
}
