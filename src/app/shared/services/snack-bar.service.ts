import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private readonly snackBar: MatSnackBar,
              private readonly translateService: TranslateService) {
  }

  public showSuccessNotification(customMessage: string = null) {
    customMessage ?
      this.showNotification(customMessage, 'snackbar-success') :
      this.showNotification('notification.successRequestLabel', 'snackbar-success')
  }


  public showErrorNotification(errorMessage: string, customMessage: string = null): void {
    if (customMessage) {
      this.showNotification(customMessage, 'snackbar-error')

      return
    }

    errorMessage ?
      this.showNotification(errorMessage, 'snackbar-error') :
      this.showNotification('notification.errorOccurredLabel', 'snackbar-error')
  }

  private showNotification(
    message: string,
    panelClass: string = 'snackbar-error',
    actionName: string = this.translateService.instant('notification.closeLabel')): void {

    const MESSAGE = message?.includes('Label') ? this.translateService.instant(message) : message;

    this.snackBar.open(MESSAGE, actionName, {
      duration: 15000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [panelClass]
    });
  }
}
