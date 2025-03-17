import { Injectable } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {ConfirmDialogComponent} from "../components/dialogs/confirm-dialog/confirm-dialog.component";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private readonly dialog: MatDialog) {
  }

  public openConfirmDialog(title: string, message: string | null = null): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title, message } });

    return dialogRef.afterClosed().pipe(map((result) => !!result));
  }
}
