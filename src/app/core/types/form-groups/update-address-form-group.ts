import {FormControl} from "@angular/forms";
import {UpdateAddressInterface} from "../../../shared/interfaces/user/update-address.interface";

export type UpdateAddressFormGroup = {
  [K in keyof UpdateAddressInterface] : FormControl<
    UpdateAddressInterface[K]>
}
