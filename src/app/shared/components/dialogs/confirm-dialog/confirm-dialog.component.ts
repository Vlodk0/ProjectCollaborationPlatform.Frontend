import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'collabro-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {

  constructor(private readonly dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public readonly data: { title: string, message: string }) {
  }

  public closeDialog(answer: boolean): void {
    this.dialogRef.close(answer);
  }
}
