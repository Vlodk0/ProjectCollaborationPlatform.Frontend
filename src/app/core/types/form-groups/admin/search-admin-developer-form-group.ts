import {FormControl} from "@angular/forms";
import {
  AdminGetUsersRequestInterface
} from "../../../../shared/interfaces/admin/developers/admin-get-users-request.interface";

export type SearchAdminDeveloperFormGroup = {
  [K in keyof AdminGetUsersRequestInterface] : FormControl<
    AdminGetUsersRequestInterface[K]>
}
