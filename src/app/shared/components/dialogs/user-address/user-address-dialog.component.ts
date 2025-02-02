import { Component } from '@angular/core';
import {timeDurationListConstant} from "../../../../core/constants/time-duration-list.constant";

@Component({
  selector: 'collabro-user-address',
  templateUrl: './user-address-dialog.component.html',
  styleUrl: './user-address-dialog.component.scss'
})
export class UserAddressDialogComponent {

  protected readonly timeDurationListConstant = timeDurationListConstant;
}
