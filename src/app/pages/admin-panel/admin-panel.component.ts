import {Component} from '@angular/core';
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

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {
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
  selectedProject: ProjectPagination;

  isSubscribe: Subject<void> = new Subject<void>()


  paginationFilter: PaginationFilter = {
    pageNumber: 0,
    pageSize: 15,
    sortColumn: "Payment",
    sortDirection: 1
  }

  constructor(private projectService: ProjectsService,
              private feedbackService: FeedbackService,
              private devService: DeveloperService,
              private developerService: DeveloperService,
              private projectOwnerService: ProjectOwnerService) {
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
    this.paginationFilter.pageSize = 10;

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
    this.paginationFilter.pageSize = 10;

    this.projectOwnerService.getAllProjectOwners(this.paginationFilter)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe(
        response => {
          this.projectOwners = response.data;
          this.totalRecords = response.totalRecords;
        },
        error => {
          console.error('Error loading project owners:', error);
        }
      );
  }

  loadFeedbacks($event: TableLazyLoadEvent) {
    console.log($event);

    this.paginationFilter.pageNumber = $event.first || 0;
    this.paginationFilter.pageSize = 5;

    this.feedbackService.getAllFeedbacks(this.paginationFilter)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe(
        response => {
          this.feedbacks = response.data;
          this.totalRecords = response.totalRecords;
        },
        error => {
          console.error('Error loading feedbacks:', error);
        }
      );
  }


  deleteProject(project: ProjectPagination): void {
    if (project && project.id) {
      this.projectService.deleteProject(project.id)
        .subscribe(() => {
          this.loadProjects({
            first: this.paginationFilter.pageNumber,
            rows: this.paginationFilter.pageSize
          });
          this.deletingProjectsVisible = false;
        }, error => {
          console.error('Failed to delete project:', error);
        });
    } else {
      console.error('Selected project or its ID is undefined.');
    }
  }

  deleteDeveloper(dev: PaginationDeveloper): void {
    if (dev && dev.id) {
      this.devService.deleteDeveloper(dev.id)
        .subscribe(() => {
          this.loadDevelopers({
            first: this.paginationFilter.pageNumber,
            rows: this.paginationFilter.pageSize
          });
          this.deletingDevsVisible = false;
        }, error => {
          console.error('Failed to delete dev:', error);
        });
    } else {
      console.error('Selected dev or his ID is undefined.');
    }
  }

  deleteProjectOwner(projOwner: ProjectOwnerPagination): void {
    if (projOwner && projOwner.id) {
      this.projectOwnerService.deleteProjectOwner(projOwner.id)
        .subscribe(() => {
          this.loadProjectOwners({
            first: this.paginationFilter.pageNumber,
            rows: this.paginationFilter.pageSize
          });
          this.deletingProjOwnersVisible = false;
        }, error => {
          console.error('Failed to delete projOwner:', error);
        });
    } else {
      console.error('Selected projOwner or his ID is undefined.');
    }
  }

  deleteFeedback(feedback: GetFeedback): void {
    if (feedback && feedback.id) {
      this.feedbackService.deleteFeedback(feedback.id)
        .subscribe(() => {
          this.loadFeedbacks({
            first: this.paginationFilter.pageNumber,
            rows: this.paginationFilter.pageSize
          });
          this.deletingFeedbacksVisible = false;
        }, error => {
          console.error('Failed to delete feedback:', error);
        });
    } else {
      console.error('Selected feedback or his ID is undefined.');
    }
  }
}
