import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/helpers/validators/customValidators";
import {AuthService} from "../../../shared/services/auth.service";
import {Login} from "../../../shared/interfaces/login";
import {CreateProjectOwner} from "../../../shared/interfaces/create-project-owner";
import {Router} from "@angular/router";
import {CreateDeveloper} from "../../../shared/interfaces/create-developer";

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

    if(localStorage.getItem('roleChecked') === 'true') {
      this.authService.isDevAdded();
      this.authService.isCreated.subscribe((res: boolean) => {
          this.isCreated = res;
          this.isCreated ? this.router.navigateByUrl('my-profile') : this.addDeveloper()
        }
      )
    } else {
      this.authService.isProjectOwnerAdded();
      this.authService.isCreated.subscribe((res: boolean) => {
          this.isCreated = res;
          this.isCreated ? this.router.navigateByUrl('my-profile') : this.addProjectOwner()
        }
      )
    }
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
