import {FormControl} from "@angular/forms";
import {FilterProjectRequestInterface} from "../../../shared/interfaces/project/filter-project-request.interface";

export type ProjectRequestFormGroup = {
  [K in keyof FilterProjectRequestInterface] : FormControl<
    FilterProjectRequestInterface[K]>
}
