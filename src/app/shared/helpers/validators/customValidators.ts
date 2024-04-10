import {FormControl} from "@angular/forms";

export class CustomValidators {
  static passwordValidator(control: FormControl) {
    const passwordPattern = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
    return passwordPattern.test(control.value) ? null : {invalidPassword: true};

  }


  static emailValidator(control: FormControl) {
    const emailPattern = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(control.value) ? null : {invalidEmail: true};
  }
}
