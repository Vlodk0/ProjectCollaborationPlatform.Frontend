import { FormControl } from '@angular/forms';
import {BadgesInterface} from "../../../shared/interfaces/badges.interface";

export type BadgesFormGroup = {
  [K in keyof BadgesInterface]: FormControl<
    BadgesInterface[K]
  >;
}
