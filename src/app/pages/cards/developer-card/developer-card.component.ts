import { Component } from '@angular/core';
import {technologiesListConstant} from "../../../core/constants/technology-list.constant";

@Component({
  selector: 'collabro-developer-card',
  templateUrl: './developer-card.component.html',
  styleUrl: './developer-card.component.scss'
})
export class DeveloperCardComponent {

  public technologiesListConstant = technologiesListConstant;

  public technologyColors = {
    ["C#"]: 'gray',
    ["Python"]: 'pink',
    ["JavaScript"]: 'blue'
  };

  public getStyleForTechnologies(code: string): { background: string } {
    return { background: this.technologyColors[code] || 'black' };
  }}
