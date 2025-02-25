import {FormControl} from "@angular/forms";
import {DeveloperRequestInterface} from "../../../shared/interfaces/developer/developer-request.interface";

export type DeveloperRequestFormGroup = {
  [K in keyof DeveloperRequestInterface] : FormControl<
    DeveloperRequestInterface[K]>
}
