import { Component } from '@angular/core';
import {technologiesListConstant} from "../../../core/constants/technology-list.constant";
import {MatDialog} from "@angular/material/dialog";
import {
  DeveloperInfoDialogComponent
} from "../../../shared/components/dialogs/developer-info/developer-info-dialog.component";

@Component({
  selector: 'collabro-developer-card',
  templateUrl: './developer-card.component.html',
  styleUrl: './developer-card.component.scss'
})
export class DeveloperCardComponent {

  constructor(private readonly matDialog: MatDialog) {
  }

  public technologiesListConstant = technologiesListConstant;

  public technologyColors = {
    ["C#"]: 'gray',
    ["Python"]: 'pink',
    ["JavaScript"]: 'blue'
  };

  public getStyleForTechnologies(code: string): { background: string } {
    return { background: this.technologyColors[code] || 'black' };
  }

  public openDeveloperInfoDialog(): void {
    const dialogRef = this.matDialog.open(DeveloperInfoDialogComponent, {
      disableClose: false
    });

    dialogRef.afterClosed().subscribe();
  }
}
