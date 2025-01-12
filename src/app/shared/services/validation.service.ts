import { Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  private config = {};

  constructor(private readonly translateService: TranslateService) {
    this.initConfig();

    translateService.onLangChange
      .subscribe({
        next: () => this.initConfig()
      });
  }

  public emailValidator(control: FormControl): any {
    const emailRegex = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');

    if (control.value === null) {
      return null;
    }
    if (control.value === '') {
      return null;
    }
    if (!emailRegex.test(control.value)) {
      return { 'emailIncorrect': true };
    }

    return null;
  }

  public swiftValidator(control: FormControl): any {
    if (control.value?.length === 8 || control.value?.length === 11) {
      return null;
    }

    return { 'swiftIncorrect': true };
  }

  public whitespaceValidator(control: FormControl): { whitespace: boolean } | null {
    const isSpace = !(control?.value || '').match(/\S/g);

    return isSpace && !!control.value?.length ? { 'whitespace': true } : null;
  }

  public profileLanguageValidator(control: FormControl): any {
    if (typeof control.value === 'string' && control.value?.length > 0) {
      return { 'incorrectLanguage': true };
    }

    return null;
  }

  public getValidatorErrorMessage(control: any, config = this.config): any {
    if (control) {
      for (const propertyName in control.errors) {
        if (control.errors.hasOwnProperty(propertyName)) {
          if (propertyName === 'min') {
            return config[propertyName];
          }

          return config[propertyName];
        }
      }
    }

    return null;
  }




  public fileSizeValidator(maxFileSize: number): any {
    return (control: FormControl): ValidationErrors | null => {
      if (control?.value?.size >= maxFileSize) {
        return { 'incorrectSize': maxFileSize };
      } else
        return null;
    };
  }

  public fileTypeValidator(allowedTypes: string[]): any {
    return (control: FormControl): ValidationErrors | null => {
      if (!allowedTypes.includes(control?.value?.type)) {
        return { 'incorrectType': allowedTypes };
      } else
        return null;
    };
  }

  private initConfig(): void {
    this.translateService.get('validationService')
      .subscribe({
        next: (result) => this.config = result
      });
  }

  public atLeastOneCheckboxCheckedValidator(fields: string[]): any {
    return (control: FormControl): ValidationErrors | null => {
      let checkboxes: boolean[] = [];

      fields.forEach((field) => checkboxes.push(control.get(field).value));
      const isChecked = checkboxes.some(control => control === true);

      return isChecked ? null : { atLeastOneCheckboxChecked: true };
    };
  };

  public atLeastOneFieldValidator(group: FormGroup): ValidationErrors | null {
    const hasValue = Object.values(group.value).some(value => value != null && value !== '');
    return hasValue ? null : { atLeastOneRequired: true };
  }
}
