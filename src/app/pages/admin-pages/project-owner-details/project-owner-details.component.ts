import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectOwnerDetailsTabsEnum} from "../../../core/enums/pages/project-owner-details-tabs.enum";
import {ActivatedRoute} from "@angular/router";
import {finalize, Subject, takeUntil} from "rxjs";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {SpinnerService} from "../../../shared/services/spinner.service";
import {
  AdminProjectOwnerDataInterface
} from "../../../shared/interfaces/admin/project-owners/admin-project-owner-data.interface";
import {AdminProjectOwnerService} from "../../../shared/services/admin/admin-project-owner.service";
import {AdminProjectDataInterface} from "../../../shared/interfaces/admin/projects/admin-project-data.interface";
import {
  AdminFeedbackDataInterface
} from "../../../shared/interfaces/admin/project-owners/admin-feedback-data.interface";
import {DeveloperFeedbackService} from "../../../shared/services/developer-feedback.service";
import {ProjectOwnerFeedbackService} from "../../../shared/services/project-owner-feedback.service";
import {FeedbackInterface} from "../../../shared/interfaces/feedback/feedback.interface";
import {UserService} from "../../../shared/services/user.service";
import {GetUser} from "../../../shared/interfaces/get-user";

@Component({
  selector: 'collabro-project-owner-details',
  templateUrl: './project-owner-details.component.html',
  styleUrl: './project-owner-details.component.scss'
})
export class ProjectOwnerDetailsComponent implements OnInit, OnDestroy {
  public tabIndex: ProjectOwnerDetailsTabsEnum = ProjectOwnerDetailsTabsEnum.Profile;
  public projectOwnerId: string;
  public projectOwner: AdminProjectOwnerDataInterface;
  public projects: AdminProjectDataInterface[] = [];
  public feedbacks: AdminFeedbackDataInterface[] = [];
  public developerFeedbacks: FeedbackInterface[] = [];
  public imageData: string | ArrayBuffer | null;
  public isLoadingProjects = true;
  public isLoadingFeedbacks = true;
  public user: GetUser;

  private projectsCurrentPage: number = 0;
  private totalProjects: number = 0;
  private feedbacksCurrentPage: number = 0;
  private totalFeedbacks: number = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly adminProjectOwnerService: AdminProjectOwnerService,
              private readonly projectOwnerFeedbackService: ProjectOwnerFeedbackService,
              private readonly spinnerService: SpinnerService,
              private readonly cdr: ChangeDetectorRef,
              private readonly userService: UserService,
              private readonly feedbackService: DeveloperFeedbackService,
              private readonly notificationService: SnackBarService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.projectOwnerId = params['id'];
    });

    this.subscribeToCurrentUser();

    this.getProjectOwner();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private subscribeToCurrentUser(): void {
    this.userService.currentUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: user => {
          this.user = user;
        }
      });
  }

  private getFeedbackAvatars(): void {
    debugger
    if (!this.developerFeedbacks?.length) {
      return;
    }

    this.spinnerService.showSpinner();

    this.developerFeedbacks.forEach(feedback => {
      if (!feedback.avatarName) {
        return;
      }

      this.userService.getAvatar(feedback.avatarName)
        .pipe(
          finalize(() => this.spinnerService.hideSpinner()),
          takeUntil(this.unsubscribe$)
        )
        .subscribe({
          next: result => {
            this.createImageFromBlob(result);
          }
        });
    });
  }

  public deleteFeedback(feedbackId: string): void {
    this.spinnerService.showSpinner();

    this.feedbackService.deleteFeedback(feedbackId)
      .pipe(
        finalize(() => this.spinnerService.hideSpinner()),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.getProjectOwnerFeedbacks();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });
  }

  public loadingProjects(resetPage: boolean) {
    if (resetPage) {
      this.getProjects(false);
    } else if (this.totalProjects > this.projects.length && !this.isLoadingProjects) {
      this.getProjects(true);
    }
  }

  private getProjects(onScroll = false): void {
    this.spinnerService.showSpinner();

    if (!onScroll) {
      this.projectsCurrentPage = 0;
    }

    this.isLoadingProjects = true;

    this.adminProjectOwnerService.getProjectOwnerProjects(this.projectOwnerId, this.projectsCurrentPage, 20)
      .pipe(finalize(() => {
          this.isLoadingProjects = false;
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.totalProjects = result.total;
          this.projectsCurrentPage++;

          if (onScroll) {
            this.projects.push(...result.items);
          } else {
            this.projects = result.items;
          }

        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  private getProjectOwner(): void {
    this.spinnerService.showSpinner();

    this.adminProjectOwnerService.getProjectOwner(this.projectOwnerId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.projectOwner = result;
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  public loadingProjectOwnerFeedbacks(resetPage: boolean) {
    if (resetPage) {
      this.getProjectOwnerFeedbacks(false);
    } else if (this.totalFeedbacks > this.feedbacks.length && !this.isLoadingFeedbacks) {
      this.getProjectOwnerFeedbacks(true);
    }
  }

  public loadingDeveloperFeedbacks(resetPage: boolean) {
    if (resetPage) {
      this.getDeveloperFeedbacks(false);
    } else if (this.totalFeedbacks > this.feedbacks.length && !this.isLoadingFeedbacks) {
      this.getDeveloperFeedbacks(true);
    }
  }

  private getProjectOwnerFeedbacks(onScroll = false): void {
    this.spinnerService.showSpinner();

    if (!onScroll) {
      this.feedbacksCurrentPage = 0;
    }

    this.isLoadingFeedbacks = true;

    this.adminProjectOwnerService.getProjectOwnerFeedbacks(this.projectOwnerId, this.feedbacksCurrentPage, 20)
      .pipe(finalize(() => {
          this.isLoadingFeedbacks = false;
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.totalFeedbacks = result.total;
          this.feedbacksCurrentPage++;

          if (onScroll) {
            this.feedbacks.push(...result.items);
          } else {
            this.feedbacks = result.items;
          }
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  private getDeveloperFeedbacks(onScroll = false): void {
    this.spinnerService.showSpinner();

    if (!onScroll) {
      this.feedbacksCurrentPage = 0;
    }

    this.isLoadingFeedbacks = true;

    this.projectOwnerFeedbackService.getAllProjectOwnerFeedbacks(this.projectOwnerId, this.feedbacksCurrentPage, 20)
      .pipe(finalize(() => {
          this.isLoadingFeedbacks = false;
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.totalFeedbacks = result.total;
          this.feedbacksCurrentPage++;

          if (onScroll) {
            this.developerFeedbacks.push(...result.items);
          } else {
            this.developerFeedbacks = result.items;
          }

          this.getFeedbackAvatars();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
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

  public selectedTabChange(): void {
    if (this.tabIndex === ProjectOwnerDetailsTabsEnum.Profile) {
      this.projectOwner = null;
      this.getProjectOwner();
    } else if (this.tabIndex === ProjectOwnerDetailsTabsEnum.Projects) {
      this.projects = [];
      this.getProjects();
    } else if (this.tabIndex === ProjectOwnerDetailsTabsEnum.Feedbacks) {
      this.feedbacks = [];
      this.getProjectOwnerFeedbacks()
    } else if (this.tabIndex === ProjectOwnerDetailsTabsEnum.DeveloperFeedbacks) {
      this.developerFeedbacks = [];
      this.getDeveloperFeedbacks();
    }
  }
}
