import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ButtonComponent} from './shared/components/button/button.component';
import {InputComponent} from './shared/components/input/input.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SidebarComponent} from './core/sidebar/sidebar.component';
import {HeaderComponent} from './core/header/header.component';
import {ProfilePageComponent} from './pages/profile-page/profile-page.component';
import {InputSwitchModule} from "primeng/inputswitch";
import {AvatarModule} from "primeng/avatar";
import {AllProjectsPageComponent} from './pages/all-projects-page/all-projects-page.component';
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
import {EmailSuccessPageComponent} from './static-pages/email-success-page/email-success-page.component';
import {EmailFailedPageComponent} from './static-pages/email-failed-page/email-failed-page.component';
import {AllProjectsPageModule} from "./pages/all-projects-page/all-projects-page.module";
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';
import {MultiSelectModule} from "primeng/multiselect";
import {SharedModule} from "./shared/shared.module";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProjectPageComponent} from './pages/project-page/project-page.component';
import {PageNotFoundComponent} from './static-pages/page-not-found/page-not-found.component';
import {DialogModule} from "primeng/dialog";
import {DragDropModule} from "primeng/dragdrop";
import {AllDevelopersPageComponent} from './pages/all-developers-page/all-developers-page.component';
import {MyProjectsPageComponent} from './pages/my-projects-page/my-projects-page.component';
import {DropdownModule} from "primeng/dropdown";
import {ProjectInfoPageComponent} from './pages/project-info-page/project-info-page.component';
import {DevPageComponent} from './pages/dev-page/dev-page.component';
import {PaginatorModule} from "primeng/paginator";
import {AdminPanelComponent} from './pages/admin-panel/admin-panel.component';
import {FileUploadModule} from "primeng/fileupload";
import {EmptyStateComponent} from "./shared/components/empty-state/empty-state.component";
import {
  ControlValidationMessageComponent
} from "./shared/components/control-validation-message/control-validation-message.component";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSidenavModule} from "@angular/material/sidenav";
import {RootComponent} from "./shared/components/root/root.component";
import {RootModule} from "./shared/components/root/root.module";
import {SpinnerComponent} from "./shared/components/spinner/spinner.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {PaginatorComponent} from "./shared/components/paginator/paginator.component";
import {MatInputModule} from "@angular/material/input";

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const MODULES = [
  BrowserModule,
  MatInputModule,
  MatProgressSpinner,
  AppRoutingModule,
  ReactiveFormsModule,
  InputSwitchModule,
  AvatarModule,
  TableModule,
  ButtonModule,
  HttpClientModule,
  BrowserAnimationsModule,
  MessagesModule,
  ToastModule,
  AllProjectsPageModule,
  MultiSelectModule,
  FormsModule,
  SharedModule,
  ConfirmDialogModule,
  DialogModule,
  DragDropModule,
  DropdownModule,
  PaginatorModule,
  FileUploadModule,
  MatIcon,
  MatIconButton,
  MatTooltip,
  MatButton,
  MatSidenavModule,
  RootModule,
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [HttpClient]
    }
  }),
];

@NgModule({
  declarations: [
    AppComponent,
    PaginatorComponent,
    SpinnerComponent,
    RootComponent,
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
    EmailSuccessPageComponent,
    EmailFailedPageComponent,
    SettingsPageComponent,
    ProjectPageComponent,
    PageNotFoundComponent,
    AllDevelopersPageComponent,
    MyProjectsPageComponent,
    ProjectInfoPageComponent,
    DevPageComponent,
    AdminPanelComponent,
    EmptyStateComponent,
    ControlValidationMessageComponent
  ],
  imports: [
    ...MODULES
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [
    ButtonComponent,
    MatSidenavModule,
    SidebarComponent
  ]
})
export class AppModule {
}
