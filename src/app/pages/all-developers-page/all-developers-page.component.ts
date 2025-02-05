import {Component, OnDestroy, OnInit} from '@angular/core';
import {PaginationDeveloper} from "../../shared/interfaces/pagination-developer";
import {DeveloperTechnology} from "../../shared/interfaces/developer-technology";
import {Subject, takeUntil} from "rxjs";
import {PaginationFilterDevs} from "../../shared/interfaces/pagination-filter-devs";
import {DeveloperService} from "../../shared/services/developer.service";
import {ProjectInfo} from "../../shared/interfaces/project-info";
import {ProjectsService} from "../../shared/services/projects.service";
import {technologiesListConstant} from "../../core/constants/technology-list.constant";
import {GetUser} from "../../shared/interfaces/get-user";
import {UserService} from "../../shared/services/user.service";
import {ProjectInterface} from "../../shared/interfaces/project/project.interface";
import {PageProjectInterface} from "../../shared/interfaces/project/page-project.interface";

@Component({
  selector: 'app-all-developers-page',
  templateUrl: './all-developers-page.component.html',
  styleUrl: './all-developers-page.component.scss'
})
export class AllDevelopersPageComponent implements OnDestroy, OnInit {
  visible: boolean = false;
  addDevVisible: boolean = false;
  developers: PaginationDeveloper[];
  technologies: DeveloperTechnology[];x
  projectDropDownItems: PageProjectInterface[];
  isSubscribe: Subject<void> = new Subject<void>()
  selectedProjects: ProjectInfo;
  selectedDeveloper: PaginationDeveloper | undefined

  public technologiesListConstant = technologiesListConstant;

  public technologyColors = {
    ["C#"]: 'gray',
    ["Python"]: 'pink',
    ["JavaScript"]: 'blue'
  };

  public getStyleForTechnologies(code: string): { background: string } {
    return { background: this.technologyColors[code] || 'black' };
  }

  paginationFilter: PaginationFilterDevs = {
    pageNumber: 0,
    pageSize: 15,
  }

  user: GetUser = {
    id: '',
    lastName: '',
    firstName: '',
    email: '',
    roleName: '',
    isDeleted: false
  }

  constructor(private developerService: DeveloperService,
              private projectService: ProjectsService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getUser()
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: value => {
          this.user = value;
        },
        error: err => {
          console.log(err)
        }
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
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: () => {
          //this.messageService.add({severity:'success', summary:'Developer added'});
        },
        error: () => {
          //this.messageService.add({severity:'error', summary:'Error adding'});
        }
      })
  }

  showDialog(technologies: DeveloperTechnology[]) {
    this.technologies = technologies
    this.visible = true
  }

  // showAddingDevDialog() {
  //   this.addDevVisible = true
  //   this.projectService.getProjectOwnerProjects()
  //     .pipe(
  //       takeUntil(this.isSubscribe)
  //     )
  //     .subscribe({
  //       next: value => this.projectDropDownItems = value
  //     })
  // }
  ngOnDestroy() {
    this.isSubscribe.next();
    this.isSubscribe.complete();
  }
}
