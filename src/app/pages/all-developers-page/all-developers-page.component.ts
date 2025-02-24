import {Component, OnDestroy, OnInit} from '@angular/core';
import {DeveloperTechnology} from "../../shared/interfaces/developer-technology";
import {finalize, Subject, takeUntil} from "rxjs";
import {DeveloperService} from "../../shared/services/developer.service";
import {ProjectsService} from "../../shared/services/projects.service";
import {GetUser} from "../../shared/interfaces/get-user";
import {UserService} from "../../shared/services/user.service";
import {SpinnerService} from "../../shared/services/spinner.service";
import {DeveloperInterface} from "../../shared/interfaces/developer/developer.interface";
import {NotificationService} from "../../shared/services/notification.service";

@Component({
  selector: 'app-all-developers-page',
  templateUrl: './all-developers-page.component.html',
  styleUrl: './all-developers-page.component.scss'
})
export class AllDevelopersPageComponent implements OnDestroy, OnInit {
  technologies: DeveloperTechnology[];

  public isLoadingDevelopers = true;
  public developers: DeveloperInterface[] = []

  private developersCurrentPage: number = 0;
  private totalDevelopers: number = 0;

  private unsubscribe$: Subject<void> = new Subject<void>();

  user: GetUser = {
    id: '',
    lastName: '',
    firstName: '',
    email: '',
    roleName: '',
    isDeleted: false
  }

  constructor(private readonly developerService: DeveloperService,
              private readonly projectService: ProjectsService,
              private readonly userService: UserService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: NotificationService) {
  }

  ngOnInit() {
    this.getUser();
    this.getDevelopers();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getUser() {
    this.userService.getUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: value => {
          this.user = value;
        },
        error: err => {
          console.log(err)
        }
      })
  }

  public loadingDevelopers(resetPage: boolean) {
    if (resetPage) {
      this.getDevelopers(false);
    } else if (this.totalDevelopers > this.developers.length && !this.isLoadingDevelopers) {
      this.getDevelopers(true);
    }
  }

  private getDevelopers(onScroll = false): void {
    this.spinnerService.showSpinner();

    if (!onScroll) {
      this.developersCurrentPage = 0;
    }

    this.isLoadingDevelopers = true;

    this.developerService.getDevelopers(this.developersCurrentPage, 20)
      .pipe(finalize(() => {
        this.isLoadingDevelopers = false;
        this.spinnerService.hideSpinner();
      }),
      takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.totalDevelopers = result.total;
          this.developersCurrentPage++;

          if (onScroll) {
            this.developers.push(...result.items);
          } else {
            this.developers = result.items;
          }
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }
}
