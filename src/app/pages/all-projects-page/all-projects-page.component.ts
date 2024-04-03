import {Component, OnDestroy} from '@angular/core';
import {TableLazyLoadEvent} from "primeng/table";
import {PaginationFilter} from "../../core/Interfaces/pagination-filter";
import {ProjectsService} from "../../core/services/projects.service";
import {ProjectPagination} from "../../core/Interfaces/project-pagination";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-all-projects-page',
  templateUrl: './all-projects-page.component.html',
  styleUrl: './all-projects-page.component.scss',
  providers: [ProjectsService]
})

export class AllProjectsPageComponent implements OnDestroy {
  projects: ProjectPagination[];
  totalRecords: number = 1;

  isSubscribe: Subject<void> = new Subject<void>()

  paginationFilter: PaginationFilter = {
    pageNumber: 0,
    pageSize: 15,
    sortColumn: "Payment",
    sortDirection: 1
  }


  constructor(private projectService: ProjectsService) {
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


