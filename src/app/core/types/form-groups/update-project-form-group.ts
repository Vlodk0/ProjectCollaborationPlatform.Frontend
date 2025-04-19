import {CreateProjectInterface} from "../../../shared/interfaces/project/create-project.interface";
import {FormControl} from "@angular/forms";
import {UpdateProjectInterface} from "../../../shared/interfaces/project/update-project.interface";

export type UpdateProjectFormGroup = {
  [K in keyof UpdateProjectInterface] : FormControl<
    UpdateProjectInterface[K]>
}
