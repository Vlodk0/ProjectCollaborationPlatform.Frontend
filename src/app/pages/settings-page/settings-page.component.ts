import {Component, OnInit} from '@angular/core';

interface Technologies {
  name: string,
  framework: string
}

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent implements OnInit{

  technologies: Technologies[] = [];

  selectedTechnologies: Technologies[];

  ngOnInit() {
    this.technologies = [
      {name: 'C#', framework: '.NET'},
      {name: 'Java', framework: 'Spring'},
      {name: 'JavaScript', framework: 'Angular'},
      {name: 'Python', framework: 'Django'},
      {name: 'PHP', framework: 'Laravel'},
    ]
  };
}
