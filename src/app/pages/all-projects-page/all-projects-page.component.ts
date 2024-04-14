import {Component, OnDestroy} from '@angular/core';
import {TableLazyLoadEvent} from "primeng/table";
import {PaginationFilter} from "../../shared/interfaces/pagination-filter";
import {ProjectsService} from "../../shared/services/projects.service";
import {ProjectPagination} from "../../shared/interfaces/project-pagination";
import {Subject, takeUntil} from "rxjs";
import {DeveloperTechnology} from "../../shared/interfaces/developer-technology";

@Component({
  selector: 'app-all-projects-page',
  templateUrl: './all-projects-page.component.html',
  styleUrl: './all-projects-page.component.scss',
  providers: [ProjectsService]
})

export class AllProjectsPageComponent implements OnDestroy {
  visible: boolean = false;
  projects: ProjectPagination[];
  totalRecords: number = 1;
  technologies: DeveloperTechnology[];

  isSubscribe: Subject<void> = new Subject<void>()

  paginationFilter: PaginationFilter = {
    pageNumber: 0,
    pageSize: 15,
    sortColumn: "Payment",
    sortDirection: 1
  }


  constructor(private projectService: ProjectsService) {
  }

  showDialog(technologies: DeveloperTechnology[]) {
    this.technologies = technologies
    this.visible = true
  }

  loadProjects($event: TableLazyLoadEvent) {
    console.log($event);

    this.paginationFilter.pageNumber = $event.first || 0;
    this.paginationFilter.pageSize = $event.rows || 10;
    this.paginationFilter.sortColumn = $event.sortField?.toString() || "Payment";
    this.paginationFilter.sortDirection = $event.sortOrder || 1;

    this.projectService.getAllProjects(this.paginationFilter)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe(response => {
        this.projects = response.data;
        this.totalRecords = response.totalRecords;
      })
  }

  ngOnDestroy() {
    this.isSubscribe.next();
    this.isSubscribe.complete();
  }
}


