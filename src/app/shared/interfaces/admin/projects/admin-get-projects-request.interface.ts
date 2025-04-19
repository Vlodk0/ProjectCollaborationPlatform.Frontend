import {ProjectSortClauseEnum} from "../../../../core/enums/admin/project-sort-clause.enum";
import {ProjectType} from "../../../../core/enums/project-type.enum";
import {TimeDuration} from "../../../../core/enums/time-duration.enum";
import {ProjectStatusEnum} from "../../../../core/enums/project-status.enum";

export interface AdminGetProjectsRequestInterface {
  searchTerm: string;
  countryCodes: string[];
  projectTypes: ProjectType[];
  projectTimeDurations: TimeDuration[];
  projectStatuses: ProjectStatusEnum[];
  currentPage: number;
  pageSize: number;
  sortByProperty: ProjectSortClauseEnum;
  sortOrder: 'asc' | 'desc';
}
