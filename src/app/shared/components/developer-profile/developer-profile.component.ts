import { Component } from '@angular/core';
import { technologiesListConstant } from '../../../core/constants/technology-list.constant';
import { frameworkListConstant } from '../../../core/constants/framework-list.constant';

@Component({
  selector: 'collabro-developer-profile',
  templateUrl: './developer-profile.component.html',
  styleUrl: './developer-profile.component.scss'
})
export class DeveloperProfileComponent {
  public technologiesListConstant = technologiesListConstant;
  public frameworkListConstant = frameworkListConstant;

  public technologyColors = {
    ["C#"]: 'gray',
    ["Python"]: 'pink',
    ["Java"]: 'blue'
  };
  public frameworkColors = {
    ["ASP.NET Core"]: 'gray',
    ["Angular"]: 'pink',
    ["React"]: 'blue'
  };

  public getStyleForTechnologies(code: string): { background: string } {
    return { background: this.technologyColors[code] || 'black' };
  }
  public getStyleForFrameworks(code: string): { background: string } {
    return { background: this.frameworkColors[code] || 'black' };
  }
}
