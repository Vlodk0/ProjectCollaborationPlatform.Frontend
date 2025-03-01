import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  DeveloperInfoDialogComponent
} from "../../../../shared/components/dialogs/developer-info/developer-info-dialog.component";
import {DeveloperInterface} from "../../../../shared/interfaces/developer/developer.interface";
import {finalize, Subject, takeUntil} from "rxjs";
import {SpinnerService} from "../../../../shared/services/spinner.service";
import {UserService} from "../../../../shared/services/user.service";

@Component({
  selector: 'collabro-developer-card',
  templateUrl: './developer-card.component.html',
  styleUrl: './developer-card.component.scss'
})
export class DeveloperCardComponent implements OnInit, OnDestroy {
  @Input() developer: DeveloperInterface

  public imageData: string | ArrayBuffer | null;

  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(private readonly matDialog: MatDialog,
              private readonly spinnerService: SpinnerService,
              private readonly cdr: ChangeDetectorRef,
              private readonly userService: UserService) {
  }

  ngOnInit(): void {
    this.getAvatar();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public openDeveloperInfoDialog(developer: DeveloperInterface): void {
    const dialogRef = this.matDialog.open(DeveloperInfoDialogComponent, {
      disableClose: false,
      data: {
        developer: developer,
        developerAvatar: this.imageData
      }
    });

    dialogRef.afterClosed().subscribe();
  }

  private getAvatar(): void {
    const developerAvatar = this.developer?.avatarName;
    if (!developerAvatar) {
      return;
    }

    this.spinnerService.showSpinner();

    this.userService.getAvatar(this.developer?.avatarName)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.createImageFromBlob(result);
        }
      })
  }

  private createImageFromBlob(image: Blob): void {
    if (!image) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageData = reader.result;
      this.spinnerService.hideSpinner();
      this.cdr.detectChanges();
    }, false);

    reader.readAsDataURL(image);
  }
}
