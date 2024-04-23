import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectPagination} from "../../shared/interfaces/project-pagination";
import {DeveloperTechnology} from "../../shared/interfaces/developer-technology";
import {Subject, takeUntil} from "rxjs";
import {PaginationFilter} from "../../shared/interfaces/pagination-filter";
import {ProjectsService} from "../../shared/services/projects.service";
import {TableLazyLoadEvent} from "primeng/table";
import {FormControl, FormGroup} from "@angular/forms";
import {CreateProject} from "../../shared/interfaces/create-project";
import {Router} from "@angular/router";
import {GetUser} from "../../shared/interfaces/get-user";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-my-projects-page',
  templateUrl: './my-projects-page.component.html',
  styleUrl: './my-projects-page.component.scss'
})
export class MyProjectsPageComponent implements OnDestroy, OnInit {

  visible: boolean = false;
  creationVisible: boolean = false;
  projects: ProjectPagination[];
  totalRecords: number = 1;
  technologies: DeveloperTechnology[];
  creationProjectForm: FormGroup;

  isSubscribe: Subject<void> = new Subject<void>()

  paginationFilter: PaginationFilter = {
    pageNumber: 0,
    pageSize: 15,
    sortColumn: "Payment",
    sortDirection: 1
  }

  user: GetUser = {
    id: '',
    lastName: '',
    firstName: '',
    email: '',
    roleName: '',
    isDeleted: false
  }


  constructor(private projectService: ProjectsService, private router: Router,
              private userService: UserService) {
  }

  showDialog(technologies: DeveloperTechnology[]) {
    this.technologies = technologies
    this.visible = true
  }

  getUser() {
    this.userService.getUser()
      .subscribe((result: any) => {
          this.user = result;
          console.log('success')
        },
        (error) => {
          console.log('Error', error)
        })
  }

  showProjectCreationDialog() {
    this.creationVisible = true
  }

  loadProjects($event: TableLazyLoadEvent) {
    console.log($event);

    this.paginationFilter.pageNumber = $event.first || 0;
    this.paginationFilter.pageSize = $event.rows || 10;
    this.paginationFilter.sortColumn = $event.sortField?.toString() || "Payment";
    this.paginationFilter.sortDirection = $event.sortOrder || 1;

    this.projectService.getAllProjectsByProjectOwner(this.paginationFilter)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe(response => {
        this.projects = response.data;
        this.totalRecords = response.totalRecords;
      })
  }

  ngOnInit() {
    this.creationProjectForm = new FormGroup({
      title: new FormControl(''),
      shortInfo: new FormControl(''),
      payment: new FormControl(0),
      description: new FormControl('')
    })

    this.getUser()
  }

  onSubmit() {
    if (this.creationProjectForm.valid) {
      const projectObj: CreateProject = {
        title: this.creationProjectForm.value.title,
        shortInfo: this.creationProjectForm.value.shortInfo,
        payment: this.creationProjectForm.value.payment,
        description: this.creationProjectForm.value.description,
        boardName: `${this.creationProjectForm.value.title}'s board`
      }

      this.projectService.createProject(projectObj)
        .subscribe((response) => {
            this.creationVisible = false;
            this.router.navigateByUrl('my-project/:id')
          },
          (error) => {
            console.error('Error creating Project:', error);
          })
    }
  }

  ngOnDestroy() {
    this.isSubscribe.next();
    this.isSubscribe.complete();
  }
}
