import {DashboardNameValueItem} from "./dashboard-name-value-item.interface";

export interface DashboardAggregationDataInterface {
  developerCount: number;
  activeDeveloperCount: number;
  deletedDeveloperCount: number;
  projectOwnerCount: number;
  activeProjectOwnerCount: number;
  deletedProjectOwnerCount: number;
  projectCount: number;
  projectByType: DashboardNameValueItem<string, number>[];
  projectByTimeDuration: DashboardNameValueItem<string, number>[];
  projectByDay: DashboardNameValueItem<string, number>[];
}
