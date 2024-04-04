import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { InputComponent } from './shared/components/input/input.component';
import {ReactiveFormsModule} from "@angular/forms";
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { HeaderComponent } from './core/header/header.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import {InputSwitchModule} from "primeng/inputswitch";
import {AvatarModule} from "primeng/avatar";
import { AllProjectsPageComponent } from './pages/all-projects-page/all-projects-page.component';
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthPageComponent} from "./pages/auth-pages/auth-page.component";
import {AfterRegisterPageComponent} from "./pages/auth-pages/after-register-page/after-register-page.component";
import {LoginPageComponent} from "./pages/auth-pages/login-page/login-page.component";
import {RegisterPageComponent} from "./pages/auth-pages/register-page/register-page.component";
import {ResetPasswordPageComponent} from "./pages/auth-pages/reset-password-page/reset-password-page.component";
import {HttpRequestInterceptor} from "./core/interceptors/auth.interceptor";
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";

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
    InputSwitchModule, AvatarModule, TableModule, ButtonModule, HttpClientModule, BrowserAnimationsModule, MessagesModule, ToastModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
