import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinnerStateSubject: Subject<boolean> = new Subject<boolean>();
  public spinnerState$: Observable<boolean> = this.spinnerStateSubject.asObservable();
  private spinnerInProgress = false;
  private triggerFinished = true;

  public showSpinner(): void {
    if (this.spinnerInProgress) {
      return;
    }

    this.triggerFinished = false;
    if (!this.triggerFinished) {
      this.spinnerStateSubject.next(true);
    }
  }

  public hideSpinner(): void {
    this.triggerFinished = true;
    this.spinnerStateSubject.next(false);
  }
}
