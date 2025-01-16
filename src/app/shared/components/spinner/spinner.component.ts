import { Component } from '@angular/core';
import {SpinnerService} from "../../services/spinner.service";

@Component({
  selector: 'collabro-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  constructor(public readonly spinnerService: SpinnerService) {
  }
}
