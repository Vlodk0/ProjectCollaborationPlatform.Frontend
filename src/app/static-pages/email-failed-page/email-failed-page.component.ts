import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-failed-page',
  templateUrl: './email-failed-page.component.html',
  styleUrl: './email-failed-page.component.scss',
})
export class EmailFailedPageComponent implements OnInit {
  constructor(private readonly router: Router) {}

  ngOnInit() {
    //TODO: why are you sure that 3000 mils would be enough for user to see and read the message?
    //TODO: in general, you should leave it open and add some button that will take user to a signup page
    setTimeout(() => {
      this.router.navigate(['../signup']);
    }, 3000);
  }
}
