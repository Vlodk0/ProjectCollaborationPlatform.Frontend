import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  AdminProjectOwnerDataInterface
} from "../../../shared/interfaces/admin/project-owners/admin-project-owner-data.interface";
import {finalize, Subject, takeUntil} from "rxjs";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'collabro-project-owners-profile',
  templateUrl: './project-owners-profile.component.html',
  styleUrl: './project-owners-profile.component.scss'
})
export class ProjectOwnersProfileComponent implements OnInit, OnDestroy {
  @Input() projectOwner: AdminProjectOwnerDataInterface;

  public imageData: string | ArrayBuffer | null;

  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(private readonly spinnerService: SpinnerService,
              private readonly userService: UserService,
              private readonly cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.getAvatar();
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getAvatar(): void {
    if (!this.projectOwner.avatarName) {
      return;
    }

    this.spinnerService.showSpinner();

    this.userService.getAvatar(this.projectOwner.avatarName)
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

  public createImageFromBlob(image: Blob): void {
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
