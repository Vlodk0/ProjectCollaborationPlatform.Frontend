import { Component } from '@angular/core';

@Component({
  selector: 'app-after-register-page',
  templateUrl: './after-register-page.component.html',
  styleUrl: './after-register-page.component.scss',
})
export class AfterRegisterPageComponent {
  context: String = 'Sign up';
  styleContext: String = 'after-register-button';
}
