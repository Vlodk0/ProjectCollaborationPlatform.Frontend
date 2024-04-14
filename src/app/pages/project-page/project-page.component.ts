import { Component, OnInit } from '@angular/core';
import { ProjectsService } from "../../shared/services/projects.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { ProjectInfo } from "../../shared/interfaces/project-info";
import { FormControl, FormGroup } from "@angular/forms";
import { BoardService } from "../../shared/services/board.service";
import { Board } from "../../shared/interfaces/board";

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit {

  projects: Observable<ProjectInfo>;
  visible: boolean = false;
  creationForm: FormGroup;
  projectId: string;
  isDisabled: boolean = false;

  constructor(
    private projectService: ProjectsService,
    private activatedRoute: ActivatedRoute,
    private boardService: BoardService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.projectId = params['id'];
    });

    this.projects = this.projectService.getProjectById(this.projectId);

    // Initialize the form group
    this.creationForm = new FormGroup({
      name: new FormControl('')
    });
  }

  showBoardCreationDialog() {
    this.visible = true;
  }

  onSubmit() {
    if (this.creationForm.valid) {
      const boardObj: Board = {
        name: this.creationForm.value.name
      };

      this.boardService.createBoard(boardObj, this.projectId).subscribe(
        (response) => {
          console.log('Board created successfully:', response);
          this.visible = false;
          this.isDisabled = true;
        },
        (error) => {
          console.error('Error creating board:', error);
        }
      );
    }
  }
}
