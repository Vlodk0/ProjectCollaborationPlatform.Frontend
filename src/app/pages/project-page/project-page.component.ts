import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectsService} from "../../shared/services/projects.service";
import {ActivatedRoute} from "@angular/router";
import {filter, finalize, Observable, Subject, takeUntil} from "rxjs";
import {ProjectInfo} from "../../shared/interfaces/project-info";
import {FormControl, FormGroup} from "@angular/forms";
import {FunctionalityBlock} from "../../shared/interfaces/functionality-block";
import {FunctionalityBlockService} from "../../shared/services/functionality-block.service";
import {Technology} from "../../shared/interfaces/technology";
import {TechnologyService} from "../../shared/services/technology.service";
import {GetUser} from "../../shared/interfaces/get-user";
import {UserService} from "../../shared/services/user.service";
import {TechnologyInterface} from "../../shared/interfaces/project/technology.interface";
import {ProjectInterface} from "../../shared/interfaces/project/project.interface";
import {SpinnerService} from "../../shared/services/spinner.service";
import {NotificationService} from "../../shared/services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {ProjectTaskDialogComponent} from "../../shared/components/dialogs/project-task/project-task-dialog.component";
import {TaskLabelType} from "../../core/enums/task-label-type.enum";
import {TaskStatus} from "../../core/enums/task-status.enum";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {FunctionalityBlockInterface} from "../../shared/interfaces/project/functionality-block.interface";
import {ProjectRequestService} from "../../shared/services/project-request.service";
import {ProjectRequestInterface} from "../../shared/interfaces/project/project-request.interface";

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
  providers: [FunctionalityBlockService]
})
export class ProjectPageComponent implements OnInit, OnDestroy {

  projects$: Observable<ProjectInfo>;
  tasks$: Observable<FunctionalityBlock[]>
  taskVisible: boolean = false;
  updateTaskVisible: boolean = false;
  addTechVisible: boolean = false;
  removeTechVisible: boolean = false;
  updateProjVisible: boolean = false;
  updateProjDetailVisible: boolean = false;
  creationTaskForm: FormGroup;
  updatingTaskForm: FormGroup;
  updatingProjectForm: FormGroup;
  updatingProjectDetailForm: FormGroup;
  boardId: string;
  funcBlockId: string;
  showBoard = false;
  technologiesDropDownItems: TechnologyInterface[]
  projectTechnologiesDropDownItems: Technology[]
  selectedTechnologies: Technology[]

  public project: ProjectInterface = null;
  public projectRequests: ProjectRequestInterface[] = [];
  public developerTableColumns = ['fullName', 'location', 'action'];
  public taskStatusEnum = TaskStatus;
  public todoTasks: FunctionalityBlockInterface[] = [];
  public inProgressTasks: FunctionalityBlockInterface[] = [];
  public doneTasks: FunctionalityBlockInterface[] = [];

  public technologyColors = {
    ["C#"]: 'gray',
    ["Python"]: 'pink',
    ["Java"]: 'blue'
  };
  public frameworkColors = {
    ["ASP.NET Core"]: 'gray',
    ["Angular"]: 'pink',
    ["React"]: 'blue'
  };

  private projectId: string;

  private unsubscribe$: Subject<void> = new Subject<void>();


  constructor(
    private projectService: ProjectsService,
    private activatedRoute: ActivatedRoute,
    private functionalityBlockService: FunctionalityBlockService,
    private technologyService: TechnologyService,
    private userService: UserService,
    private readonly matDialog: MatDialog,
    private readonly spinnerService: SpinnerService,
    private readonly notificationService: NotificationService,
    private readonly projectRequestService: ProjectRequestService
  ) {
  }

  public user: GetUser;

  availableTasks: FunctionalityBlock[] = [];

  selectedTasks: FunctionalityBlock[] = [];

  draggedTask: FunctionalityBlock | undefined | null;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
    });

    this.subscribeToCurrentUser();

    this.getProject();

    this.getProjectRequests();

    this.projects$.subscribe(project => {
      this.boardId = project.boardId;
    });


    this.creationTaskForm = new FormGroup({
      task: new FormControl('')
    });

    this.updatingTaskForm = new FormGroup({
      task: new FormControl('')
    })

    this.updatingProjectForm = new FormGroup({
      title: new FormControl(''),
      shortInfo: new FormControl(''),
      payment: new FormControl(0),
      description: new FormControl('')
    })

    this.updatingProjectDetailForm = new FormGroup({
      description: new FormControl('')
    })

    this.technologyService.getAllTechnologies()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: value => this.technologiesDropDownItems = value
      })

    this.technologyService.getAllProjectTechnologies(this.projectId)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: value => this.projectTechnologiesDropDownItems = value
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private initializeTaskArrays() {
    this.todoTasks = this.project.projectTasks.filter(task => task.status === TaskStatus.Todo);
    this.inProgressTasks = this.project.projectTasks.filter(task => task.status === TaskStatus.InProgress);
    this.doneTasks = this.project.projectTasks.filter(task => task.status === TaskStatus.Done);
  }

  public getProjectRequests(): void {
    this.spinnerService.showSpinner();

    this.projectRequestService.getProjectRequests(this.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.projectRequests = result;
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  public acceptProjectRequest(projectRequestId: string): void {
    this.spinnerService.showSpinner();

    this.projectRequestService.acceptProjectRequest(projectRequestId, this.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.getProjectRequests();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  public declineProjectRequest(projectRequestId: string): void {
    this.spinnerService.showSpinner();

    this.projectRequestService.declineProjectRequest(projectRequestId, this.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.notificationService.showSuccessNotification();
          this.getProjectRequests();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  public onTaskDrop(event: CdkDragDrop<any[]>, newStatus: TaskStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.item.data;
      task.status = newStatus;

      this.functionalityBlockService.updateTaskStatus(task.id, newStatus)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
        next: () => {
          this.initializeTaskArrays();
        },
        error: () => {
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
          task.status = event.previousContainer.id === 'todoList' ? TaskStatus.Todo :
            event.previousContainer.id === 'inProgressList' ? TaskStatus.InProgress :
              TaskStatus.Done;
        }
      });
    }
  }

  public getStyleForTechnologies(code: string): { background: string } {
    return { background: this.technologyColors[code] || '#4B4D52' };
  }
  public getStyleForFrameworks(code: string): { background: string } {
    return { background: this.frameworkColors[code] || '#4B4D52' };
  }

  public subscribeToCurrentUser(): void {
    this.userService.currentUser$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: user => {
          this.user = user;
          console.log(this.user.id);
        }
      });
  }

  private getProject(): void {
    this.spinnerService.showSpinner();

    this.projectService.getProjectById(this.projectId)
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: result => {
          this.project = result;
          this.initializeTaskArrays();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      })
  }

  public editProjectTask(task: FunctionalityBlockInterface, taskName: string, description: string, label: TaskLabelType): void {
    const dialogRef = this.matDialog.open(ProjectTaskDialogComponent, {
      disableClose: false,
      data: {
        projectId: this.projectId,
        task,
        taskName,
        description,
        label,
        developers: this.project.developers,
      }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((result) => result)
      )
      .subscribe({
        next: () => {
          this.getProjectTasks();
        }
      });
  }

  public addProjectTask(): void {
    const dialogRef = this.matDialog.open(ProjectTaskDialogComponent, {
      disableClose: false,
      data: {
        projectId: this.projectId
      }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((result) => result)
      )
      .subscribe({
        next: () => {
          this.getProjectTasks();
        }
      });
  }

  private getProjectTasks(): void {
    this.spinnerService.showSpinner();

    this.functionalityBlockService.getProjectTasks(this.projectId)
      .pipe(takeUntil(this.unsubscribe$),
        finalize(() => this.spinnerService.hideSpinner()))
      .subscribe({
        next: (result) => {
          this.project.projectTasks = result;
          this.initializeTaskArrays();
        },
        error: (error) => this.notificationService.showErrorNotification(error?.error?.detail)
      });
  }
}
