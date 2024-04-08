import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/helpers/validators/customValidators";
import {AuthService} from "../../../shared/services/auth.service";
import {Login} from "../../../shared/interfaces/login";
import {CreateProjectOwner} from "../../../shared/interfaces/create-project-owner";
import {Router} from "@angular/router";
import {CreateDeveloper} from "../../../shared/interfaces/create-developer";
import {catchError, of, switchMap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  providers: [AuthService]
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup;
  private isCreated: boolean;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, CustomValidators.passwordValidator]),
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

    this.authService.login(loginObj)
      .pipe(
        switchMap((res: any) => {
          localStorage.setItem('access_token', res.accessToken);
          localStorage.setItem('refresh_token', res.refreshToken);
          return this.authService.isProjectOwnerAdded()
            .pipe(
              catchError(err => {
                if (err instanceof HttpErrorResponse) {
                  if (err.status === 404) {
                    this.addProjectOwner()
                  } else if (err.status === 401) {
                    console.log("User unauthorized")
                  } else if (err.status === 500) {
                    console.log("Internal server error")
                  } else {
                    console.log("error", err.status)
                  }
                }
                return of(err);
              })
            )
        })
      )
      .subscribe(
        () => {
          this.router.navigateByUrl('my-profile')
        }
      )
  }

  private addProjectOwner() {
    let userObj: CreateProjectOwner = {
      firstName: localStorage.getItem("firstName"),
      lastName: localStorage.getItem("lastName"),
    }
    this.authService.createProjectOwner(userObj)
  }

  private addDeveloper() {
    let userObj: CreateDeveloper = {
      firstName: localStorage.getItem("firstName"),
      lastName: localStorage.getItem("lastName"),
    }
    this.authService.createDev(userObj)
  }
}
