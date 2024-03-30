import { Component } from '@angular/core';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
})
export class ResetPasswordPageComponent {
  context: String = 'Reset password';
  styleContext: String = 'reset-button';
}
