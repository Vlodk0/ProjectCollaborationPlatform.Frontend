import { Component, Input } from '@angular/core';
import { AbstractControl } from "@angular/forms";
import {ValidationService} from "../../services/validation.service";


@Component({
  selector: 'collabro-control-validation-message',
  templateUrl: './control-validation-message.component.html',
  styleUrl: './control-validation-message.component.scss'
})
export class ControlValidationMessageComponent {
  @Input() public control: AbstractControl<any>;
  @Input() public translation: any;

  constructor(private readonly validationService: ValidationService) {
  }

  public get errorMessage(): string {
    return this.validationService.getValidatorErrorMessage(this.control, this.translation);
  }
}
