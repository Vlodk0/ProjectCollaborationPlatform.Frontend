import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/helpers/validators/customValidators";
import {AuthService} from "../../../shared/services/auth.service";
import {Register} from "../../../shared/interfaces/register";
import {MessageService} from "primeng/api";
import {catchError, of} from "rxjs";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  providers: [AuthService, MessageService]
})
export class RegisterPageComponent implements OnInit {

  registerForm!: FormGroup
  private isRegistered: boolean;

  addSuccessMessage() {
    this.messageService.add({severity:'success', summary:'Email has sent!'});
  }

  addFailedMessage() {
    this.messageService.add({severity:'error', summary:'Email has not sent!'});
  }

  add505ErrorMessage() {
    this.messageService.add({severity:'error', summary:'Server error "-505"'});
  }

  constructor(private authService: AuthService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, CustomValidators.passwordValidator]),
      checked: new FormControl(false),
    });
  }


  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }

    let registerObj: Register = {
      name: this.registerForm.value.email,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      roleName: this.registerForm.value.checked === false ? "ProjectOwner" : "Dev"
    }
    this.authService.isDev = this.registerForm.value.checked;


    localStorage.setItem("firstName", this.registerForm.value.firstName)
    localStorage.setItem("lastName", this.registerForm.value.lastName)
    this.authService.register(registerObj)
      .pipe(
        catchError(err => {
          if (err.status === 500) {
            this.add505ErrorMessage()
          } else {
            console.log("error", err.status)
          }
          return of(err);
        })
      )
      .subscribe((res:any) => {
        this.isRegistered = res;
        this.isRegistered ? this.addSuccessMessage() : this.addFailedMessage();
      })
  }
}
