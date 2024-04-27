import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-email-failed-page',
  templateUrl: './email-failed-page.component.html',
  styleUrl: './email-failed-page.component.scss'
})
export class EmailFailedPageComponent implements OnInit{
  constructor(private readonly router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['../signup']);
    }, 3000);
  }

}
