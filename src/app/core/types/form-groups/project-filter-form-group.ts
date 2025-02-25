import {FormControl} from "@angular/forms";
import {ProjectFilterInterface} from "../../../shared/interfaces/project/project-filter.interface";

export type ProjectFilterFormGroup = {
  [K in keyof ProjectFilterInterface] : FormControl<
    ProjectFilterInterface[K]>
}
