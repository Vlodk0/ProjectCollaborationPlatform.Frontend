import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {PaginationResponse} from "../../shared/interfaces/pagination-response";
import {GetFeedback} from "../../shared/interfaces/get-feedback";
import {FeedbackService} from "../../shared/services/feedback.service";
import {PaginationFilterDevs} from "../../shared/interfaces/pagination-filter-devs";
import {PaginatorState} from "primeng/paginator";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit {
  feedbacks$: Observable<PaginationResponse<GetFeedback[]>>
  paginationFilter: PaginationFilterDevs = {
    pageNumber: 0,
    pageSize: 10
  };

  constructor(private feedbackService: FeedbackService) {
  }

  ngOnInit() {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbacks$ = this.feedbackService.getAllFeedbackForCurrentDeveloper(
      this.paginationFilter
    )
  }

  onPageChange(event: PaginatorState): void {
    this.paginationFilter.pageNumber = event.first;
    this.paginationFilter.pageSize = 10;
    this.loadFeedbacks();
  }
}
