import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TaskStatus} from "../../../../core/enums/task-status.enum";
import {FunctionalityBlock} from "../../../../shared/interfaces/functionality-block";
import {filter, finalize, Subject, takeUntil} from "rxjs";
import {FunctionalityBlockService} from "../../../../shared/services/functionality-block.service";
import {SpinnerService} from "../../../../shared/services/spinner.service";
import {NotificationService} from "../../../../shared/services/notification.service";
import {FunctionalityBlockInterface} from "../../../../shared/interfaces/project/functionality-block.interface";
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
  @Input() todoTasks: FunctionalityBlockInterface[] = [];
  @Input() inProgressTasks: FunctionalityBlockInterface[] = [];
  @Input() doneTasks: FunctionalityBlockInterface[] = [];

  @Output() projectTasksUpdated: EventEmitter<void> = new EventEmitter<void>();

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly functionalityBlockService: FunctionalityBlockService,
              private readonly spinnerService: SpinnerService,
              private readonly notificationService: NotificationService,
              private readonly matDialog: MatDialog) {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
