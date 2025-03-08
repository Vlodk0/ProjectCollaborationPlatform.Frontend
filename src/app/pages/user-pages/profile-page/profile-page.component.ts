import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {filter, finalize, Subject, takeUntil} from "rxjs";
import {UserService} from "../../../shared/services/user.service";
import {DeveloperService} from "../../../shared/services/developer.service";
import {MatDialog} from "@angular/material/dialog";
import {
  UserPersonalInfoDialogComponent
} from "../../../shared/components/dialogs/user-personal-info/user-personal-info-dialog.component";
import {UserAddressDialogComponent} from "../../../shared/components/dialogs/user-address/user-address-dialog.component";
import {FrameworkDialogComponent} from "../../../shared/components/dialogs/framework-dialog/framework-dialog.component";
import {TechnologyDialogComponent} from "../../../shared/components/dialogs/technology-dialog/technology-dialog.component";
import {GetUser} from "../../../shared/interfaces/get-user";
import {ApplicationRoleEnum} from "../../../core/enums/application-role.enum";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {DeveloperInterface} from "../../../shared/interfaces/developer/developer.interface";
import {ProjectOwnerService} from "../../../shared/services/project-owner.service";
import {ProjectOwnerInterface} from "../../../shared/interfaces/project/project-owner.interface";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  public user: GetUser = null;
  public commonUser: DeveloperInterface | ProjectOwnerInterface = null;
  public developer: DeveloperInterface = null;
  public applicationRoleEnum = ApplicationRoleEnum;
  public avatarUrl: string;
  public imageData: string | ArrayBuffer | null;

  private unsubscribe$: Subject<void> = new Subject<void>();

  private avatar: File;

  constructor(private readonly userService: UserService,
              private readonly matDialog: MatDialog,
              private readonly cdr: ChangeDetectorRef,
              private readonly spinnerService: SpinnerService,
              private readonly developerService: DeveloperService,
              private readonly projectOwnerService: ProjectOwnerService) {
  }

  ngOnInit() {
    this.subscribeToCurrentUser();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public uploadAvatar(event): void {
    this.avatar = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsDataURL(this.avatar);
    fileReader.onload = (event) => this.avatarUrl = (event.target.result as string);

    const formData = new FormData();
    formData.append('file', this.avatar, this.avatar.name);

    this.userService.uploadAvatar(formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.subscribeToCurrentUser();
        }
      });
  }

  public subscribeToCurrentUser(): void {
    this.userService.currentUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: user => {
          this.user = user;

          if (this.user?.roleName) {
            this.user.roleName === ApplicationRoleEnum.Dev
              ? this.getDeveloper(this.user?.id)
              : this.getProjectOwner(this.user?.id);
          }
        }
      });
  }

  private getDeveloper(developerId: string) {
    this.spinnerService.showSpinner();

    this.developerService.getDeveloper(developerId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.commonUser = result;
          this.developer = result;
          this.getAvatar();
        }
      })
  }

  private getProjectOwner(projectOwnerId: string) {
    this.spinnerService.showSpinner();

    this.projectOwnerService.getProjectOwner(projectOwnerId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.commonUser = result;
          this.getAvatar();
        }
      })
  }

  private getAvatar(): void {
    if (!this.commonUser.avatarName) {
      return;
    }

    this.spinnerService.showSpinner();

    this.userService.getAvatar(this.commonUser.avatarName)
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

  public openUpdatePersonalInfoDialog(): void {
    const dialogRef = this.matDialog.open(UserPersonalInfoDialogComponent, {
      disableClose: false,
      data: {
        firstName: this.commonUser.firstName,
        lastName: this.commonUser.lastName,
        bio: this.commonUser.bio
      }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((result) => result)
      )
      .subscribe({
        next: () => {
          this.subscribeToCurrentUser();
        }
      });
  }

  public openAddressDialog(): void {
    const dialogRef = this.matDialog.open(UserAddressDialogComponent, {
      disableClose: true,
      data: {
        countryCode: this.commonUser?.address?.countryCode,
        city: this.commonUser?.address?.city,
        state: this.commonUser?.address?.state
      }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((result) => result)
      )
      .subscribe({
        next: () => {
          this.subscribeToCurrentUser();
        }
      });
  }

  public openFrameworkDialog(): void {
    const dialogRef = this.matDialog.open(FrameworkDialogComponent, {
      disableClose: false,
      data: {
        developerFrameworks: this.developer.frameworks,
      }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((result) => result)
      )
      .subscribe({
        next: () => {
          this.getDeveloper(this.user.id);
        }
      });
  }

  public openTechnologyDialog(): void {
    const dialogRef = this.matDialog.open(TechnologyDialogComponent, {
      disableClose: false,
      data: {
        developerTechnologies: this.developer.technologies
      }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((result) => result)
      )
      .subscribe({
        next: () => {
          this.getDeveloper(this.user.id);
        }
      });
  }
}
