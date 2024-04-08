import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-email-success-page',
  templateUrl: './email-success-page.component.html',
  styleUrl: './email-success-page.component.scss'
})
export class EmailSuccessPageComponent implements OnInit{
  constructor(private readonly router: Router) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['../signin']);
    }, 3000);
  }
}
