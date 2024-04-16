import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../../shared/services/projects.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ProjectInfo } from "../../shared/interfaces/project-info";
import { FormControl, FormGroup } from "@angular/forms";
import { BoardService } from "../../shared/services/board.service";
import { Board } from "../../shared/interfaces/board";
import {FunctionalityBlock} from "../../shared/interfaces/functionality-block";
import {FunctionalityBlockService} from "../../shared/services/functionality-block.service";

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit {

  projects$: Observable<ProjectInfo>;
  tasks$: Observable<FunctionalityBlock[]>
  visible: boolean = false;
  taskVisible: boolean = false;
  updateTaskVisible: boolean = false;
  creationForm: FormGroup;
  creationTaskForm: FormGroup;
  updatingTaskForm: FormGroup;
  projectId: string;
  boardId: string;
  funcBlockId: string;
  isDisabled: boolean = false;
  showBoard = false;

  constructor(
    private projectService: ProjectsService,
    private activatedRoute: ActivatedRoute,
    private boardService: BoardService,
    private functionalityBlockService: FunctionalityBlockService
  ) {}

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
      this.tasks$ = this.functionalityBlockService.getTasksByBoardId(this.boardId);
    });



    this.creationForm = new FormGroup({
      name: new FormControl('')
    });

    this.creationTaskForm = new FormGroup({
      task: new FormControl('')
    });

    this.updatingTaskForm = new FormGroup({
      task: new FormControl('')
    })
  }

  toggleBoard() {
    this.showBoard = !this.showBoard;
  }

  dragStart(task: FunctionalityBlock) {
    this.draggedTask = task;
  }

  drop(targetColumn: string) {
    if (this.draggedTask) {
      if (targetColumn === 'todo') {
        if (this.selectedTasks.includes(this.draggedTask)) {
          this.selectedTasks = this.selectedTasks.filter(t => t !== this.draggedTask);
        } else if (this.doneTasks.includes(this.draggedTask)) {
          this.doneTasks = this.doneTasks.filter(t   => t !== this.draggedTask);
        }
        this.availableTasks.push(this.draggedTask);
      } else if (targetColumn === 'inProcess') {
        if (this.availableTasks.includes(this.draggedTask)) {
          this.availableTasks = this.availableTasks.filter(t => t !== this.draggedTask);
        } else if (this.doneTasks.includes(this.draggedTask)) {
          this.doneTasks = this.doneTasks.filter(t => t !== this.draggedTask);
        }
        this.selectedTasks.push(this.draggedTask);
      } else if (targetColumn === 'done') {
        if (this.availableTasks.includes(this.draggedTask)) {
          this.availableTasks = this.availableTasks.filter(t => t !== this.draggedTask);
        } else if (this.selectedTasks.includes(this.draggedTask)) {
          this.selectedTasks = this.selectedTasks.filter(t => t !== this.draggedTask);
        }
        this.doneTasks.push(this.draggedTask);
      }
      this.draggedTask = null;
    }
  }

  dragEnd() {
    this.draggedTask = null;
  }

  showBoardCreationDialog() {
    this.visible = true;
  }

  showTaskCreationDialog() {
    this.taskVisible = true;
  }

  showTaskUpdatingDialog() {
    this.updateTaskVisible = true;
  }

  onSubmit() {
    if (this.creationForm.valid) {
      const boardObj: Board = {
        name: this.creationForm.value.name
      };

      this.boardService.createBoard(boardObj, this.projectId).subscribe(
        (response) => {
          console.log('Board created successfully:', response);
          this.visible = false;
          this.isDisabled = true;
        },
        (error) => {
          console.error('Error creating board:', error);
        }
      );
    }
  }

  createTask() {
    if (this.creationTaskForm.valid) {
      const taskObj: FunctionalityBlock = {
        id: '',
        task: this.creationTaskForm.value.task
      };

      console.log(this.boardId)
      this.tasks$ = this.functionalityBlockService.getTasksByBoardId(this.boardId);

      this.functionalityBlockService.createFunctionalityBlock(taskObj, this.boardId)
        .subscribe(
          (response) => {
            console.log('Task created successfully:', response);
            this.taskVisible = false;
          },
          (error) => {
            console.error('Error creating board:', error);
          }
        )
      setTimeout(function(){
        window.location.reload();
      }, 2000);
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
        task: this.updatingTaskForm.value.task
      };

      console.log(this.funcBlockId)

      this.functionalityBlockService.updateTask(taskObj, this.funcBlockId)
        .subscribe(
          (response) => {
            console.log('Task updated successfully:', response);
            this.updateTaskVisible = false;
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
      const taskObj: FunctionalityBlock = {
        id: this.funcBlockId,
        task: this.updatingTaskForm.value.task
      };

      console.log(this.funcBlockId)

      this.functionalityBlockService.deleteTask(this.funcBlockId)
        .subscribe(
          (response) => {
            console.log('Task deleted successfully:', response);
            this.updateTaskVisible = false;
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
