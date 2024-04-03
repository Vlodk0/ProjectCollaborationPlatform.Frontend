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
import {ReactiveFormsModule} from "@angular/forms";
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { HeaderComponent } from './core/header/header.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import {InputSwitchModule} from "primeng/inputswitch";
import {AvatarModule} from "primeng/avatar";
import { AllProjectsPageComponent } from './pages/all-projects-page/all-projects-page.component';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    AuthPageComponent,
    AfterRegisterPageComponent,
    InputComponent,
    ButtonComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ResetPasswordPageComponent,
    SidebarComponent,
    HeaderComponent,
    ProfilePageComponent,
    AllProjectsPageComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule,
    InputSwitchModule, AvatarModule, TableModule, ButtonModule, HttpClientModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
