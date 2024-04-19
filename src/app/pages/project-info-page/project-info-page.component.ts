import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {ProjectInfo} from "../../shared/interfaces/project-info";
import {ProjectsService} from "../../shared/services/projects.service";

@Component({
  selector: 'app-project-info-page',
  templateUrl: './project-info-page.component.html',
  styleUrl: './project-info-page.component.scss'
})
export class ProjectInfoPageComponent implements OnInit{

  projectId: string;
  projects$: Observable<ProjectInfo>;

  constructor(private activateRoute: ActivatedRoute,
              private projectService: ProjectsService) {
  }


  ngOnInit() {
    this.activateRoute.params.subscribe(params => {
      this.projectId = params['id'];
    });

    this.projects$ = this.projectService.getProjectById(this.projectId);
  }
}
