import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { LoginPageComponent } from './auth-page/login-page/login-page.component';
import { RegisterPageComponent } from './auth-page/register-page/register-page.component';
import { ButtonComponent } from './shared/button/button.component';
import { InputComponent } from './shared/input/input.component';
import { AfterRegisterPageComponent } from './auth-page/after-register-page/after-register-page.component';
import { ResetPasswordPageComponent } from './auth-page/reset-password-page/reset-password-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthPageComponent,
    AfterRegisterPageComponent,
    InputComponent,
    ButtonComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ButtonComponent,
    InputComponent,
    ResetPasswordPageComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
