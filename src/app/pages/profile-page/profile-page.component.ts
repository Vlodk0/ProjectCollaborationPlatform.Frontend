import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {PaginationResponse} from "../../shared/interfaces/pagination-response";
import {GetFeedback} from "../../shared/interfaces/get-feedback";
import {FeedbackService} from "../../shared/services/feedback.service";
import {PaginationFilterDevs} from "../../shared/interfaces/pagination-filter-devs";
import {UserService} from "../../shared/services/user.service";
import {UserInfoWithAvatar} from "../../shared/interfaces/user-info-with-avatar";
import {Technology} from "../../shared/interfaces/technology";
import {DeveloperService} from "../../shared/services/developer.service";
import {technologiesListConstant} from "../../core/constants/technology-list.constant";
import {frameworkListConstant} from "../../core/constants/framework-list.constant";
import {MatDialog} from "@angular/material/dialog";
import {
  UserPersonalInfoDialogComponent
} from "../../shared/components/dialogs/user-personal-info/user-personal-info-dialog.component";
import {UserAddressDialogComponent} from "../../shared/components/dialogs/user-address/user-address-dialog.component";
import {FrameworkDialogComponent} from "../../shared/components/dialogs/framework-dialog/framework-dialog.component";
import {TechnologyDialogComponent} from "../../shared/components/dialogs/technology-dialog/technology-dialog.component";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  feedbacks$: Observable<PaginationResponse<GetFeedback[]>>
  paginationFilter: PaginationFilterDevs = {
    pageNumber: 0,
    pageSize: 10
  };

  public technologiesListConstant = technologiesListConstant;
  public frameworkListConstant = frameworkListConstant;

  isSubscribe: Subject<void> = new Subject<void>()

  technologies: Technology[];

  user: UserInfoWithAvatar = {
    id: '',
    lastName: '',
    firstName: '',
    email: '',
    roleName: '',
    isDeleted: false,
    avatarName: 'setup-avatar.png',
  }

  imageData: string | ArrayBuffer | null = "./assets/setup-avatar.png";


  constructor(private feedbackService: FeedbackService,
              private userService: UserService,
              private readonly matDialog: MatDialog,
              private developerService: DeveloperService) {
  }

  ngOnInit() {
    this.loadFeedbacks();

    this.loadUser();

    this.developerService.getAllDeveloperTechnologies()
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: value => {
          this.technologies = value
        },
        error: err =>
          console.log(err)
      })
  }

  loadUser(): void {
    this.userService.getUserWithAvatar()
      .pipe(
        switchMap((res: any) => {
          this.user = res;
          if (res.avatarName === null || res.avatarName === '') {
            return of(res)
          }
          return this.userService.getAvatar(res.avatarName)
        })
      )
      .subscribe({
        next: value => {
          this.createImageFromBlob(value)
        }
      })
  }

  createImageFromBlob(img: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageData = reader.result;
    }, false);
    if (img) {
      reader.readAsDataURL(img);
    } else {
      this.imageData = "./assets/setup-avatar.png";
    }
  }

  loadFeedbacks(): void {
    this.feedbacks$ = this.feedbackService.getAllFeedbackForCurrentDeveloper(
      this.paginationFilter
    )
      .pipe(takeUntil(this.isSubscribe))
  }

  // onPageChange(event: PaginatorState): void {
  //   this.paginationFilter.pageNumber = event.first;
  //   this.paginationFilter.pageSize = 10;
  //   this.loadFeedbacks();
  // }

  ngOnDestroy() {
    this.isSubscribe.next();
    this.isSubscribe.complete();
  }

  public openUpdatePersonalInfoDialog(): void {
    const dialogRef = this.matDialog.open(UserPersonalInfoDialogComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe();
  }

  public openAddressDialog(): void {
    const dialogRef = this.matDialog.open(UserAddressDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe();
  }

  public openFrameworkDialog(): void {
    const dialogRef = this.matDialog.open(FrameworkDialogComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe();
  }

  public openTechnologyDialog(): void {
    const dialogRef = this.matDialog.open(TechnologyDialogComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe();
  }
}
