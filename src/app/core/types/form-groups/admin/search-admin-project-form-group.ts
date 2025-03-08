import {FormControl} from "@angular/forms";
import {
  AdminGetProjectsRequestInterface
} from "../../../../shared/interfaces/admin/projects/admin-get-projects-request.interface";

export type SearchAdminProjectFormGroup = {
  [K in keyof AdminGetProjectsRequestInterface] : FormControl<
    AdminGetProjectsRequestInterface[K]>
}
