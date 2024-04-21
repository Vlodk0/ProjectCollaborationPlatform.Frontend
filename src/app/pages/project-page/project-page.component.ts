import {Component, OnInit} from '@angular/core';
import {ProjectsService} from "../../shared/services/projects.service";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, Observable, of, Subject, takeUntil} from "rxjs";
import {ProjectInfo} from "../../shared/interfaces/project-info";
import {FormControl, FormGroup} from "@angular/forms";
import {FunctionalityBlock} from "../../shared/interfaces/functionality-block";
import {FunctionalityBlockService} from "../../shared/services/functionality-block.service";
import {CreateTask} from "../../shared/interfaces/create-task";
import {Technology} from "../../shared/interfaces/technology";
import {TechnologyService} from "../../shared/services/technology.service";
import {UpdateProject} from "../../shared/interfaces/update-project";
import {ProjectDetail} from "../../shared/interfaces/project-detail";

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
  providers: [FunctionalityBlockService]
})
export class ProjectPageComponent implements OnInit {

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
  projectId: string;
  boardId: string;
  funcBlockId: string;
  showBoard = false;
  isSubscribe: Subject<void> = new Subject<void>()
  technologiesDropDownItems: Technology[]
  projectTechnologiesDropDownItems: Technology[]
  selectedTechnologies: Technology[]

  constructor(
    private projectService: ProjectsService,
    private activatedRoute: ActivatedRoute,
    private functionalityBlockService: FunctionalityBlockService,
    private technologyService: TechnologyService
  ) {
  }

  availableTasks: FunctionalityBlock[] = [];

  selectedTasks: FunctionalityBlock[] = [];
  doneTasks: FunctionalityBlock[] = [];

  draggedTask: FunctionalityBlock | undefined | null;

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
    });

    this.projects$ = this.projectService.getProjectById(this.projectId);

    this.projects$.subscribe(project => {
      this.boardId = project.boardId;
      this.loadTasksByBoardId(this.boardId);
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
        takeUntil(this.isSubscribe)
      )
      .subscribe({
        next: value => this.technologiesDropDownItems = value
      })

    this.technologyService.getAllProjectTechnologies(this.projectId)
      .pipe(
        takeUntil(this.isSubscribe)
      )
      .subscribe({
        next: value => this.projectTechnologiesDropDownItems = value
      })
  }


  addSelectedTechnology() {
    const selectedTechnologyId = this.selectedTechnologies.map(t => t.id)

    this.projectService.addTechnologiesForProject(this.projectId, selectedTechnologyId)
      .subscribe((res => {
        this.addTechVisible = false;
      }))
  }

  removeSelectedTechnology() {
    const selectedTechnologyId = this.selectedTechnologies.map(t => t.id)

    this.projectService.removeTechnologyFromProject(this.projectId, selectedTechnologyId)
      .subscribe((res => {
        this.removeTechVisible = false;
      }))
  }

  updateProject() {
    if (this.updatingProjectForm.valid) {
      const projectObj: UpdateProject = {
        title: this.updatingProjectForm.value.title,
        shortInfo: this.updatingProjectForm.value.shortInfo,
        payment: this.updatingProjectForm.value.payment,
      }

      this.projectService.updateProject(this.projectId, projectObj)
        .subscribe((res => {
          this.updateProjVisible = false;
        }))
    }
  }

  updateProjectDetail() {
    if (this.updatingProjectDetailForm.valid) {
      const projectDetailObj: ProjectDetail = {
        description: this.updatingProjectDetailForm.value.description
      }
      this.projectService.updateProjectDetails(this.projectId, projectDetailObj)
        .subscribe((res => {
          this.updateProjDetailVisible = false;
        }))
    }
  }

  showAddingTechDialog() {
    this.addTechVisible = true
  }

  showRemovingTechDialog() {
    this.removeTechVisible = true
  }

  showProjectUpdatingDialog() {
    this.updateProjVisible = true
  }

  showProjectDetailUpdatingDialog() {
    this.updateProjDetailVisible = true
  }

  loadTasksByBoardId(boardId: string) {
    this.functionalityBlockService.getTasksByBoardId(boardId)
      .subscribe(tasks => {
        this.tasks$ = this.functionalityBlockService.getTasksByBoardId(boardId);
        this.availableTasks = tasks.filter(task => task.status === 1);
        this.selectedTasks = tasks.filter(task => task.status === 2);
        this.doneTasks = tasks.filter(task => task.status === 3);
      });
  }

  toggleBoard() {
    this.showBoard = !this.showBoard;
  }

  drop(targetColumn: string) {
    if (this.draggedTask) {
      const funcBlockId = this.draggedTask.id;
      let newStatus: number;

      switch (targetColumn) {
        case 'todo':
          newStatus = 1;
          break;
        case 'inProcess':
          newStatus = 2;
          break;
        case 'done':
          newStatus = 3;
          break;
        default:
          return;
      }

      this.functionalityBlockService.updateTaskStatus(funcBlockId, newStatus)
        .pipe(
          catchError((error) => {
            console.error('Error updating task status:', error);
            return of(null);
          })
        )
        .subscribe(
          (response) => {
            if (response) {
              console.log(`Task status updated to '${targetColumn}' successfully:`, response);

              this.availableTasks = this.availableTasks.filter(t => t.id !== funcBlockId);
              this.selectedTasks = this.selectedTasks.filter(t => t.id !== funcBlockId);
              this.doneTasks = this.doneTasks.filter(t => t.id !== funcBlockId);

              if (targetColumn === 'todo') {
                this.availableTasks.push(this.draggedTask);

              } else if (targetColumn === 'inProcess') {
                this.selectedTasks.push(this.draggedTask);

              } else if (targetColumn === 'done') {
                this.doneTasks.push(this.draggedTask);

              }

              this.draggedTask = null;
            } else {
              console.log('Task status update failed');
            }
          }
        );
    }
  }

  dragStart(task: FunctionalityBlock) {
    this.draggedTask = task;
  }

  dragEnd() {
    this.draggedTask = null;
  }

  showTaskCreationDialog() {
    this.taskVisible = true;
  }

  showTaskUpdatingDialog() {
    this.updateTaskVisible = true;
  }

  createTask() {
    if (this.creationTaskForm.valid) {
      const taskObj: CreateTask = {
        status: 1,
        task: this.creationTaskForm.value.task
      };

      console.log(this.boardId)
      this.loadTasksByBoardId(this.boardId);

      this.functionalityBlockService.createFunctionalityBlock(taskObj, this.boardId)
        .subscribe(
          (response) => {
            console.log('Task created successfully:', response);
            this.taskVisible = false;
            // Refresh tasks after creation if needed
            this.loadTasksByBoardId(this.boardId);
          },
          (error) => {
            console.error('Error creating task:', error);
          }
        );
    }
  }

  getTaskIdClick(task: FunctionalityBlock) {
    const taskId = task.id;
    console.log('Task ID:', taskId);

    this.funcBlockId = taskId;
  }

  updateTask() {
    if (this.updatingTaskForm.valid) {
      const taskObj: FunctionalityBlock = {
        id: this.funcBlockId,
        status: 1,
        task: this.updatingTaskForm.value.task
      };

      console.log(this.funcBlockId)

      this.functionalityBlockService.updateTask(taskObj, this.funcBlockId)
        .subscribe(
          (response) => {
            console.log('Task updated successfully:', response);
            this.updateTaskVisible = false;
            this.loadTasksByBoardId(this.boardId);
          },
          (error) => {
            console.error('Error updating task:', error);
          }
        )
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    }
  }

  deleteTask() {
    if (this.updatingTaskForm.valid) {

      console.log(this.funcBlockId)

      this.functionalityBlockService.deleteTask(this.funcBlockId)
        .subscribe(
          (response) => {
            console.log('Task deleted successfully:', response);
            this.updateTaskVisible = false;
            this.loadTasksByBoardId(this.boardId);
          },
          (error) => {
            console.error('Error deleting task:', error);
          }
        )
      setTimeout(function () {
        window.location.reload();
      }, 2000);
    }
  }
}
