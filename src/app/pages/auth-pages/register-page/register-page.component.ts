import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CustomValidators} from "../../../shared/helpers/validators/customValidators";
import {AuthService} from "../../../shared/services/auth.service";
import {Register} from "../../../shared/interfaces/register";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  providers: [AuthService, MessageService]
})
export class RegisterPageComponent implements OnInit {

  registerForm!: FormGroup
  checked: boolean;
  private isRegistered: boolean;

  addSuccessMessage() {
    this.messageService.add({severity:'success', summary:'Email has sent!'});
  }

  addFailedMessage() {
    this.messageService.add({severity:'error', summary:'Email has not sent!'});
  }

  constructor(private authService: AuthService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, CustomValidators.passwordValidator]),
      // password: new FormControl('', validators.required)
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
      roleName: this.checked === false ? "ProjectOwner" : "Dev"
    }

    this.authService.register(registerObj);
    this.authService.result.subscribe((res: boolean) => {
      this.isRegistered = res;
      this.isRegistered ? this.addSuccessMessage() : this.addFailedMessage();
    })
  }
}
