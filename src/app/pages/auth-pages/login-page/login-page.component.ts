import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {Login} from "../../../shared/interfaces/login";
import {CreateProjectOwner} from "../../../shared/interfaces/user/create-project-owner";
import {Router} from "@angular/router";
import {CreateDeveloper} from "../../../shared/interfaces/create-developer";
import {catchError, of, switchMap, throwError} from "rxjs";
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

  constructor(private readonly authService: AuthService,
              private readonly router: Router) {
  }

  ngOnInit() {
    this.setForm();
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
          return this.authService.isUserAdded()
            .pipe(
              catchError(err => {
                if (err instanceof HttpErrorResponse)
                  if (err.status === 404) {
                    if (err.error.detail === 'Developer was not found')
                      this.addDeveloper()
                    else if (err.error.detail === 'Project Owner with such id is not found') this.addProjectOwner()
                  } else if (err.status === 401) {
                    // //this.messageService.add({
                    //   severity: 'error',
                    //   summary: 'Missing or Incorrect Authentication Credentials!'
                    // })
                  } else if (err.status === 403) {
                    return throwError('Forbidden')
                  } else if (err.status === 500) {
                    ////this.messageService.add({severity: 'error', summary: 'Server error "-505"'})
                  } else {
                    console.log("error", err.status)
                  }
                return of(err)
              })
            )
        })
      )
      .subscribe({
          next: () => {
            this.router.navigateByUrl('my-profile')
          },
          error: (error) => {
            if (error === 'Forbidden') {
              // //this.messageService.add({
              //   severity: 'error',
              //   summary: 'You are blocked on our service'
              // })
            }
          }
        },
      )
  }
  private addProjectOwner() {
    let userObj: CreateProjectOwner = {
      firstName: "",
      lastName: "",
      email: "",
    }
    this.authService.createProjectOwner(userObj)
  }

  private addDeveloper() {
    let userObj: CreateDeveloper = {
      firstName: "",
      lastName: "",
      email: ""
    }
    this.authService.createDev(userObj)
  }

  private setForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }
}
