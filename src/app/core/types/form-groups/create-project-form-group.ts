import {CreateProjectInterface} from "../../../shared/interfaces/project/create-project.interface";
import {FormControl} from "@angular/forms";

export type CreateProjectFormGroup = {
  [K in keyof CreateProjectInterface] : FormControl<
    CreateProjectInterface[K]>
}
