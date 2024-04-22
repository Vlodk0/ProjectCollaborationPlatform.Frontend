import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DeveloperService } from '../../shared/services/developer.service';
import { FeedbackService } from '../../shared/services/feedback.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaginationFilterDevs } from '../../shared/interfaces/pagination-filter-devs';
import { PaginationResponse } from '../../shared/interfaces/pagination-response';
import { GetFeedback } from '../../shared/interfaces/get-feedback';
import { Feedback } from '../../shared/interfaces/feedback';
import {PaginationDeveloper} from "../../shared/interfaces/pagination-developer";
import {PaginatorState} from "primeng/paginator";

@Component({
  selector: 'app-dev-page',
  templateUrl: './dev-page.component.html',
  styleUrls: ['./dev-page.component.scss']
})
export class DevPageComponent implements OnInit {
  developers$: Observable<PaginationDeveloper>;
  feedbacks$: Observable<PaginationResponse<GetFeedback[]>>;
  devId: string;
  addingFeedbackForm: FormGroup;
  paginationFilter: PaginationFilterDevs = {
    pageNumber: 0,
    pageSize: 10
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private developerService: DeveloperService,
    private feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.devId = params['id'];
      this.loadDeveloperDetails();
      this.loadFeedbacks();
    });

    this.addingFeedbackForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });
  }

  loadDeveloperDetails(): void {
    this.developers$ = this.developerService.getDeveloperById(this.devId);
  }

  loadFeedbacks(): void {
    this.feedbacks$ = this.feedbackService.getAllDeveloperFeedback(
      this.devId,
      this.paginationFilter
    )
  }

  onPageChange(event: PaginatorState): void {
    this.paginationFilter.pageNumber = event.first;
    this.paginationFilter.pageSize = 10;
    this.loadFeedbacks();
  }

  addFeedback(): void {
    if (this.addingFeedbackForm.valid) {
      const feedbackObj: Feedback = {
        content: this.addingFeedbackForm.value.content
      };

      this.feedbackService.addFeedback(this.devId, feedbackObj).subscribe(res => {
        console.log('Success', res);
        this.loadFeedbacks();
        this.addingFeedbackForm.reset();
      });
    }
  }
}
