import {UserSortingClauseEnum} from "../../../../core/enums/admin/user-sorting-clause.enum";

export interface AdminGetUsersRequestInterface {
  searchTerm: string;
  countryCodes: string[];
  currentPage: number;
  pageSize: number;
  positions?: string[];
  sortByProperty: UserSortingClauseEnum;
  sortOrder: 'asc' | 'desc';
}
