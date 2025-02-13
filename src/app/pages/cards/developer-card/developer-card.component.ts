import {Component, Input} from '@angular/core';
import {technologiesListConstant} from "../../../core/constants/technology-list.constant";
import {MatDialog} from "@angular/material/dialog";
import {
  DeveloperInfoDialogComponent
} from "../../../shared/components/dialogs/developer-info/developer-info-dialog.component";
import {DeveloperInterface} from "../../../shared/interfaces/developer/developer.interface";

@Component({
  selector: 'collabro-developer-card',
  templateUrl: './developer-card.component.html',
  styleUrl: './developer-card.component.scss'
})
export class DeveloperCardComponent {
  @Input() developer: DeveloperInterface

  constructor(private readonly matDialog: MatDialog) {
  }

  public technologiesListConstant = technologiesListConstant;

  public openDeveloperInfoDialog(developer: DeveloperInterface): void {
    const dialogRef = this.matDialog.open(DeveloperInfoDialogComponent, {
      disableClose: false,
      data: {
        developer: developer
      }
    });

    dialogRef.afterClosed().subscribe();
  }
}
