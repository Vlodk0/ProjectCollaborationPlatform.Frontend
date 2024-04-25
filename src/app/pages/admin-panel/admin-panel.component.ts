import {Component, OnDestroy} from '@angular/core';
import {ProjectsService} from "../../shared/services/projects.service";
import {FeedbackService} from "../../shared/services/feedback.service";
import {DeveloperService} from "../../shared/services/developer.service";
import {TableLazyLoadEvent} from "primeng/table";
import {Subject, takeUntil} from "rxjs";
import {PaginationFilter} from "../../shared/interfaces/pagination-filter";
import {ProjectPagination} from "../../shared/interfaces/project-pagination";
import {DeveloperTechnology} from "../../shared/interfaces/developer-technology";
import {PaginationDeveloper} from "../../shared/interfaces/pagination-developer";
import {ProjectOwnerPagination} from "../../shared/interfaces/project-owner-pagination";
import {ProjectOwnerService} from "../../shared/services/project-owner.service";
import {GetFeedback} from "../../shared/interfaces/get-feedback";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
  providers: [MessageService]
})
export class AdminPanelComponent implements OnDestroy {
  deletingDevsVisible: boolean = false
  deletingProjOwnersVisible: boolean = false
  deletingProjectsVisible: boolean = false
  deletingFeedbacksVisible: boolean = false
  visible: boolean = false;
  projects: ProjectPagination[];
  totalRecords: number = 1;
  technologies: DeveloperTechnology[];
  developers: PaginationDeveloper[];
  feedbacks: GetFeedback[];
  projectOwners: ProjectOwnerPagination[];

  isSubscribe: Subject<void> = new Subject<void>()


  paginationFilter: PaginationFilter = {
    pageNumber: 0,
    pageSize: 15,
    sortColumn: "Payment",
    sortDirection: 1
  }

  constructor(private projectService: ProjectsService,
              private feedbackService: FeedbackService,
              private developerService: DeveloperService,
              private projectOwnerService: ProjectOwnerService,
              private messageService: MessageService) {
  }

  showDialog(technologies: DeveloperTechnology[]) {
    this.technologies = technologies
    this.visible = true
  }

  showProjectDialog() {
    this.deletingProjectsVisible = true

  }

  showDevDialog() {
    this.deletingDevsVisible = true
    this.loadDevelopers({
      first: this.paginationFilter.pageNumber,
      rows: this.paginationFilter.pageSize
    });
  }

  showProjOwnerDialog() {
    this.deletingProjOwnersVisible = true
    this.loadProjectOwners({
      first: this.paginationFilter.pageNumber,
      rows: this.paginationFilter.pageSize
    });
  }

  showFeedbackDialog() {
    this.deletingFeedbacksVisible = true
    this.loadFeedbacks({
      first: this.paginationFilter.pageNumber,
      rows: this.paginationFilter.pageSize
    });
  }


  loadProjects($event: TableLazyLoadEvent) {
    console.log($event);

    this.paginationFilter.pageNumber = $event.first || 0;
    this.paginationFilter.pageSize = 15;
    this.paginationFilter.sortColumn = $event.sortField?.toString() || "Payment";
    this.paginationFilter.sortDirection = $event.sortOrder || 1;

    this.projectService.getAllProjects(this.paginationFilter)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe(response => {
        this.projects = response.data;
        this.totalRecords = response.totalRecords;
      })
  }

  loadDevelopers($event: TableLazyLoadEvent) {
    console.log($event);

    this.paginationFilter.pageNumber = $event.first || 0;
    this.paginationFilter.pageSize = 15;

    this.developerService.getAllDevelopers(this.paginationFilter)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe(response => {
        this.developers = response.data;
        this.totalRecords = response.totalRecords
      })
  }

  loadProjectOwners($event: TableLazyLoadEvent) {
    console.log($event);

    this.paginationFilter.pageNumber = $event.first || 0;
    this.paginationFilter.pageSize = 15;

    this.projectOwnerService.getAllProjectOwners(this.paginationFilter)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: value => {
          this.projectOwners = value.data;
          this.totalRecords = value.totalRecords;
        },
        error: err => {
          console.log('Error: ', err)
        }
      })
  }

  loadFeedbacks($event: TableLazyLoadEvent) {
    console.log($event);

    this.paginationFilter.pageNumber = $event.first || 0;
    this.paginationFilter.pageSize = 15;

    this.feedbackService.getAllFeedbacks(this.paginationFilter)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: value => {
          this.feedbacks = value.data;
          this.totalRecords = value.totalRecords;
        },
        error: err => {
          console.log('Error: ', err)
        }
      })
  }


  deleteProject(project: ProjectPagination): void {
    this.projectService.deleteProject(project.id)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: () => {
          this.loadProjects({
            first: this.paginationFilter.pageNumber,
            rows: this.paginationFilter.pageSize
          });
          this.messageService.add({severity: 'success', summary: 'Successfully deleted'});
        },
        error: () => {
          this.messageService.add({severity: 'error', summary: 'Error deleting'});
        }
      })
  }

  deleteDeveloper(dev: PaginationDeveloper): void {
    this.developerService.deleteDeveloper(dev.id)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: () => {
          this.loadDevelopers({
            first: this.paginationFilter.pageNumber,
            rows: this.paginationFilter.pageSize
          });
          this.messageService.add({severity: 'success', summary: 'Successfully deleted'});
        },
        error: () => {
          this.messageService.add({severity: 'error', summary: 'Error deleting'});
        }
      })
  }

  deleteProjectOwner(projOwner: ProjectOwnerPagination): void {
    this.projectOwnerService.deleteProjectOwner(projOwner.id)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: () => {
          this.loadProjectOwners({
            first: this.paginationFilter.pageNumber,
            rows: this.paginationFilter.pageSize
          });
          this.messageService.add({severity: 'success', summary: 'Successfully deleted'});
        },
        error: () => {
          this.messageService.add({severity: 'error', summary: 'Error deleting'});
        }
      })
  }

  deleteFeedback(feedback: GetFeedback): void {
    this.feedbackService.deleteFeedback(feedback.id)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: () => {
          this.loadFeedbacks({
            first: this.paginationFilter.pageNumber,
            rows: this.paginationFilter.pageSize
          });
          this.messageService.add({severity: 'success', summary: 'Successfully deleted'});
        },
        error: () => {
          this.messageService.add({severity: 'error', summary: 'Error deleting'});
        }
      })
  }

  ngOnDestroy() {
    this.isSubscribe.next();
    this.isSubscribe.complete();
  }
}
