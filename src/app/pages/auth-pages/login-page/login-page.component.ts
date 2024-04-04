import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/helpers/validators/customValidators";
import {AuthService} from "../../../shared/services/auth.service";
import {Login} from "../../../shared/interfaces/login";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  providers: [AuthService]
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, CustomValidators.passwordValidator]),
      // password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }

    let loginObj: Login = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    }
    this.authService.login(loginObj);
  }
}
