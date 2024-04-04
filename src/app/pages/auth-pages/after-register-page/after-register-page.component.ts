import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-after-register-page',
  templateUrl: './after-register-page.component.html',
  styleUrl: './after-register-page.component.scss',
})
export class AfterRegisterPageComponent implements OnInit{
  context: String = 'Sign up';
  styleContext: String = 'after-register-button';

  afterRegisterForm!: FormGroup;
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
  }
}
