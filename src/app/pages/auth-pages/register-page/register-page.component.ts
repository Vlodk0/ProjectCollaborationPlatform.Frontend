import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {Register} from "../../../shared/interfaces/register";
import {catchError, finalize, of} from "rxjs";
import {ApplicationRoleEnum} from "../../../core/enums/application-role.enum";
import {SpinnerService} from "../../../shared/services/spinner.service";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  providers: [AuthService]
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup
  private isRegistered: boolean;

  constructor(private authService: AuthService,
              private spinnerService: SpinnerService) {
  }

  addSuccessMessage() {
    //this.messageService.add({severity:'success', summary:'Email has sent!'});
  }

  addFailedMessage() {
    //this.messageService.add({severity:'error', summary:'Email has not sent!'});
  }

  add505ErrorMessage() {
    //this.messageService.add({severity:'error', summary:'Server error "-505"'});
  }

  ngOnInit() {
    this.setForm();
  }


  onSubmit() {
    this.spinnerService.showSpinner();

    let registerObj: Register = {
      name: this.registerForm.value.email,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      roleName: this.registerForm.value.checked ? ApplicationRoleEnum.Dev : ApplicationRoleEnum.ProjectOwner
    }

    this.authService.register(registerObj)
      .pipe(
        catchError(err => {
          if (err.status === 500) {
            this.add505ErrorMessage()
          } else {
            console.log("error", err.status)
          }
          return of(err);
        }),
        finalize(() => this.spinnerService.hideSpinner())
      )
      .subscribe((res:any) => {
        this.isRegistered = res;
        this.isRegistered ? this.addSuccessMessage() : this.addFailedMessage();
      })
  }

  private setForm(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      checked: new FormControl(false),
    });
  }
}
