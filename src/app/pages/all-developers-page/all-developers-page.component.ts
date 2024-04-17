import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationDeveloper} from "../../shared/interfaces/pagination-developer";
import {DeveloperTechnology} from "../../shared/interfaces/developer-technology";
import {Subject, takeUntil} from "rxjs";
import {PaginationFilterDevs} from "../../shared/interfaces/pagination-filter-devs";
import {DeveloperService} from "../../shared/services/developer.service";
import {TableLazyLoadEvent} from "primeng/table";

@Component({
  selector: 'app-all-developers-page',
  templateUrl: './all-developers-page.component.html',
  styleUrl: './all-developers-page.component.scss'
})
export class AllDevelopersPageComponent implements OnDestroy {
  visible: boolean = false;
  addDevVisible: boolean = false;
  developers: PaginationDeveloper[];
  totalRecords: number = 1;
  technologies: DeveloperTechnology[];

  isSubscribe: Subject<void> = new Subject<void>()

  paginationFilter: PaginationFilterDevs = {
    pageNumber: 0,
    pageSize: 15,
  }

  constructor(private developerService: DeveloperService) {
  }

  showDialog(technologies: DeveloperTechnology[]) {
    this.technologies = technologies
    this.visible = true
  }

  showAddingDevDialog() {
    this.addDevVisible = true
  }

  loadDevelopers($event: TableLazyLoadEvent) {
    console.log($event);

    this.paginationFilter.pageNumber = $event.first || 0;
    this.paginationFilter.pageSize = $event.rows || 10;

    this.developerService.getAllDevelopers(this.paginationFilter)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe(response => {
        this.developers = response.data;
        this.totalRecords = response.totalRecords
      })
  }

  ngOnDestroy() {
    this.isSubscribe.next();
    this.isSubscribe.complete();
  }
}
