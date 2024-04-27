import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreateProjectOwner} from "../../../shared/interfaces/create-project-owner";
import {AuthService} from "../../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-after-register-page',
  templateUrl: './after-register-page.component.html',
  styleUrl: './after-register-page.component.scss',
})
export class AfterRegisterPageComponent implements OnInit{
  context: String = 'Sign up';
  styleContext: String = 'after-register-button';

  afterRegisterForm!: FormGroup;
  private isCreated: boolean;
  private hasName: boolean;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.afterRegisterForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required])
    });
  }
  onSubmit() {
    if (this.afterRegisterForm.valid) {
      console.log(this.afterRegisterForm.value)
    }

    let afterEmailVerifyObj: CreateProjectOwner = {
      firstName: this.afterRegisterForm.value,
      lastName: this.afterRegisterForm.value,
    }

    // this.authService.isUserAdded(afterEmailVerifyObj.email);
    this.authService.isCreated.subscribe((res: boolean) => {
        this.isCreated = res;
      }
    )

    // this.authService.afterEmailVerify(afterEmailVerifyObj)
  }
}
