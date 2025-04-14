import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {TaskStatus} from "../../../../core/enums/task-status.enum";
import {filter, Subject, takeUntil} from "rxjs";
import {FunctionalityBlockService} from "../../../../shared/services/functionality-block.service";
import {FunctionalityBlockInterface} from "../../../../shared/interfaces/functionality-block/functionality-block.interface";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {
  ProjectTaskDialogComponent
} from "../../../../shared/components/dialogs/project-task/project-task-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {TaskLabelType} from "../../../../core/enums/task-label-type.enum";
import {DeveloperInterface} from "../../../../shared/interfaces/developer/developer.interface";

@Component({
  selector: 'collabro-project-board-section',
  templateUrl: './project-board-section.component.html',
  styleUrl: './project-board-section.component.scss'
})
export class ProjectBoardSectionComponent implements OnDestroy {
  @Input() projectId: string;
  @Input() developers: DeveloperInterface[];
  @Input() projectTasks: FunctionalityBlockInterface[];

  public taskStatusEnum = TaskStatus;
  @Input() backlogTasks: FunctionalityBlockInterface[] = [];
  @Input() todoTasks: FunctionalityBlockInterface[] = [];
  @Input() inProgressTasks: FunctionalityBlockInterface[] = [];
  @Input() qaTasks: FunctionalityBlockInterface[] = [];
  @Input() doneTasks: FunctionalityBlockInterface[] = [];

  @Output() projectTasksUpdated: EventEmitter<void> = new EventEmitter<void>();

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly functionalityBlockService: FunctionalityBlockService,
              private readonly matDialog: MatDialog) {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public onTaskDrop(event: CdkDragDrop<any[]>, newStatus: TaskStatus): void {
    const task = event.item.data;
    const previousStatus = task.status;

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    task.status = newStatus;

    this.functionalityBlockService.updateTaskStatus(task.id, newStatus)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.initializeTaskArrays();
        },
        error: () => {
          task.status = previousStatus;

          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
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
          this.projectTasksUpdated.emit();
        }
      });
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
        developers: this.developers,
      }
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((result) => result)
      )
      .subscribe({
        next: () => {
          this.projectTasksUpdated.emit();
        }
      });
  }

  private initializeTaskArrays() {
    this.todoTasks = this.projectTasks.filter(task => task.status === TaskStatus.Todo);
    this.inProgressTasks = this.projectTasks.filter(task => task.status === TaskStatus.InProgress);
    this.doneTasks = this.projectTasks.filter(task => task.status === TaskStatus.Done);
  }
}
