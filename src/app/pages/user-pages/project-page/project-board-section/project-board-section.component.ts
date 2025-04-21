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
import {GetUser} from "../../../../shared/interfaces/get-user";
import {ApplicationRoleEnum} from "../../../../core/enums/application-role.enum";
import {SnackBarService} from "../../../../shared/services/snack-bar.service";

@Component({
  selector: 'collabro-project-board-section',
  templateUrl: './project-board-section.component.html',
  styleUrl: './project-board-section.component.scss'
})
export class ProjectBoardSectionComponent implements OnDestroy {
  @Input() projectId: string;
  @Input() developers: DeveloperInterface[];
  @Input() projectTasks: FunctionalityBlockInterface[];
  @Input() backlogTasks: FunctionalityBlockInterface[] = [];
  @Input() todoTasks: FunctionalityBlockInterface[] = [];
  @Input() inProgressTasks: FunctionalityBlockInterface[] = [];
  @Input() qaTasks: FunctionalityBlockInterface[] = [];
  @Input() doneTasks: FunctionalityBlockInterface[] = [];
  @Input() currentUser: GetUser = null;

  @Output() projectTasksUpdated: EventEmitter<void> = new EventEmitter<void>();

  public taskStatusEnum = TaskStatus;
  public roleEnum = ApplicationRoleEnum;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly functionalityBlockService: FunctionalityBlockService,
              private readonly snackBarService: SnackBarService,
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

  public exportProjectTasksReport(): void {
    this.functionalityBlockService.exportProjectTasksReport(this.projectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (result) => {
          const blob = new Blob([result.body as BlobPart]);
          const downloadURL = window.URL.createObjectURL(blob);
          const link = document.createElement('a');

          const contentDispositionHeader = result.headers.get('Content-Disposition');
          let fileName = 'Project Tasks Report.txt';

          if (contentDispositionHeader) {
            const match = contentDispositionHeader.match(/filename="?([^"]+)"?/);
            if (match?.[1]) {
              fileName = match[1];
            }
          }

          link.href = downloadURL;
          link.download = fileName;
          link.click();
        },
        error: (error) => this.snackBarService.showErrorNotification(error?.error?.detail)
      });
  }


  private initializeTaskArrays() {
    this.todoTasks = this.projectTasks.filter(task => task.status === TaskStatus.Todo);
    this.inProgressTasks = this.projectTasks.filter(task => task.status === TaskStatus.InProgress);
    this.doneTasks = this.projectTasks.filter(task => task.status === TaskStatus.Done);
  }
}
