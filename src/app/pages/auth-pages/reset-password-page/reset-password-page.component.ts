import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
})
export class ResetPasswordPageComponent implements OnInit {
  context: String = 'Reset password';
  styleContext: String = 'reset-button';

  resetPasswordForm!: FormGroup;

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      console.log(this.resetPasswordForm.value);
    }
  }
}
