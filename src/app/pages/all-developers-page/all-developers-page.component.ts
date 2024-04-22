import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationDeveloper} from "../../shared/interfaces/pagination-developer";
import {DeveloperTechnology} from "../../shared/interfaces/developer-technology";
import {Subject, takeUntil} from "rxjs";
import {PaginationFilterDevs} from "../../shared/interfaces/pagination-filter-devs";
import {DeveloperService} from "../../shared/services/developer.service";
import {TableLazyLoadEvent} from "primeng/table";
import {ProjectInfo} from "../../shared/interfaces/project-info";
import {ProjectsService} from "../../shared/services/projects.service";
import {ProjectDev} from "../../shared/interfaces/project-dev";

@Component({
  selector: 'app-all-developers-page',
  templateUrl: './all-developers-page.component.html',
  styleUrl: './all-developers-page.component.scss'
})
export class AllDevelopersPageComponent implements OnDestroy, OnInit {
  visible: boolean = false;
  addDevVisible: boolean = false;
  developers: PaginationDeveloper[];
  totalRecords: number = 1;
  technologies: DeveloperTechnology[];
  projectDropDownItems: ProjectInfo[]
  isSubscribe: Subject<void> = new Subject<void>()
  selectedProjects: ProjectInfo;
  selectedDeveloper: PaginationDeveloper | undefined

  paginationFilter: PaginationFilterDevs = {
    pageNumber: 0,
    pageSize: 15,
  }

  constructor(private developerService: DeveloperService, private projectService: ProjectsService) {
  }

  ngOnInit() {
    this.projectService.getProjectOwnerProjects()
      .pipe(
        takeUntil(this.isSubscribe)
      )
      .subscribe({
        next: value => this.projectDropDownItems = value
      })
  }

  onProjectClick(selectedProject: ProjectInfo): void {
    this.selectedProjects = selectedProject;
  }

  onDeveloperClick(selectedDev: PaginationDeveloper): void {
    this.selectedDeveloper = selectedDev;
  }

  addDev() {
    console.log(this.selectedProjects.id)
    console.log(this.selectedDeveloper.id)
    this.projectService.addDevelopersOnProject(this.selectedProjects.id, [this.selectedDeveloper.id])
      .subscribe(
        () => {
          console.log('Developers added to the project successfully.');
        },
        (error) => {
          console.error('Error adding developers to the project:', error);
        }
      );
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
