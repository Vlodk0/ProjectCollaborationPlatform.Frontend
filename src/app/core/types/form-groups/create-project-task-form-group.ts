import {FormControl} from "@angular/forms";
import {
  CreateFunctionalityBlockInterface
} from "../../../shared/interfaces/functionality-block/create-functionality-block.interface";

export type CreateProjectTaskFormGroup = {
  [K in keyof CreateFunctionalityBlockInterface] : FormControl<
    CreateFunctionalityBlockInterface[K]>
}
