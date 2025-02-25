import {FormControl} from "@angular/forms";
import {DeveloperFilterInterface} from "../../../shared/interfaces/developer/developer-filter.interface";

export type DeveloperFilterFormGroup = {
  [K in keyof DeveloperFilterInterface] : FormControl<
    DeveloperFilterInterface[K]>
}
