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
import {AllProjectsPageComponent} from './pages/all-projects-page/all-projects-page.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthPageComponent} from "./pages/auth-pages/auth-page.component";
import {AfterRegisterPageComponent} from "./pages/auth-pages/after-register-page/after-register-page.component";
import {LoginPageComponent} from "./pages/auth-pages/login-page/login-page.component";
import {RegisterPageComponent} from "./pages/auth-pages/register-page/register-page.component";
import {ResetPasswordPageComponent} from "./pages/auth-pages/reset-password-page/reset-password-page.component";
import {HttpRequestInterceptor} from "./core/interceptors/auth.interceptor";
import {EmailSuccessPageComponent} from './static-pages/email-success-page/email-success-page.component';
import {EmailFailedPageComponent} from './static-pages/email-failed-page/email-failed-page.component';
import {AllProjectsPageModule} from "./pages/all-projects-page/all-projects-page.module";
import {SettingsPageComponent} from './pages/settings-page/settings-page.component';
import {SharedModule} from "./shared/shared.module";
import {ProjectPageComponent} from './pages/project-page/project-page.component';
import {PageNotFoundComponent} from './static-pages/page-not-found/page-not-found.component';
import {AllDevelopersPageComponent} from './pages/all-developers-page/all-developers-page.component';
import {MyProjectsPageComponent} from './pages/my-projects-page/my-projects-page.component';
import {ProjectInfoPageComponent} from './pages/project-info-page/project-info-page.component';
import {DevPageComponent} from './pages/dev-page/dev-page.component';
import {AdminPanelComponent} from './pages/admin-panel/admin-panel.component';
import {EmptyStateComponent} from "./shared/components/empty-state/empty-state.component";
import {
  ControlValidationMessageComponent
} from "./shared/components/control-validation-message/control-validation-message.component";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSidenavModule} from "@angular/material/sidenav";
import {RootComponent} from "./shared/components/root/root.component";
import {RootModule} from "./shared/components/root/root.module";
import {SpinnerComponent} from "./shared/components/spinner/spinner.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {PaginatorComponent} from "./shared/components/paginator/paginator.component";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import { DeveloperCardComponent } from './pages/cards/developer-card/developer-card.component';
import { ProjectCardComponent } from './pages/cards/project-card/project-card.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {
  UserPersonalInfoDialogComponent
} from "./shared/components/dialogs/user-personal-info/user-personal-info-dialog.component";
import {MatDialogClose} from "@angular/material/dialog";
import {UserAddressDialogComponent} from "./shared/components/dialogs/user-address/user-address-dialog.component";
import {DeveloperInfoDialogComponent} from "./shared/components/dialogs/developer-info/developer-info-dialog.component";
import {MatTabsModule} from "@angular/material/tabs";
import {DeveloperProfileComponent} from "./shared/components/developer-profile/developer-profile.component";
import {MatDivider} from "@angular/material/divider";
import {DeveloperCommentsComponent} from "./shared/components/developer-comments/developer-comments.component";
import {LocalDatePipe} from "./shared/pipes/local-date.pipe";
import {FrameworkDialogComponent} from "./shared/components/dialogs/framework-dialog/framework-dialog.component";
import {TechnologyDialogComponent} from "./shared/components/dialogs/technology-dialog/technology-dialog.component";
import { ProjectTypeLabelPipe } from './core/pipes/project-type-label.pipe';
import { ProjectTimeDurationLabelPipe } from './core/pipes/project-time-duration-label.pipe';
import {MatTableModule} from "@angular/material/table";

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const MODULES = [
  BrowserModule,
  MatInputModule,
  MatStepperModule,
  MatTableModule,
  MatCheckboxModule,
  MatSelectModule,
  MatTabsModule,
  MatProgressSpinner,
  AppRoutingModule,
  ReactiveFormsModule,
  HttpClientModule,
  BrowserAnimationsModule,
  AllProjectsPageModule,
  FormsModule,
  SharedModule,
  MatIcon,
  MatIconButton,
  MatTooltip,
  MatButton,
  MatSidenavModule,
  RootModule,
  MatIconModule,
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
    FrameworkDialogComponent,
    TechnologyDialogComponent,
    RootComponent,
    DeveloperInfoDialogComponent,
    DeveloperCommentsComponent,
    DeveloperProfileComponent,
    UserPersonalInfoDialogComponent,
    UserAddressDialogComponent,
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
    ControlValidationMessageComponent,
    DeveloperCardComponent,
    ProjectCardComponent,
    CreateProjectComponent,
    LocalDatePipe,
    ProjectTypeLabelPipe,
    ProjectTimeDurationLabelPipe
  ],
  imports: [
    ...MODULES,
    MatDialogClose,
    MatDivider
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    },
    LocalDatePipe
  ],
  bootstrap: [AppComponent],
  exports: [
    ButtonComponent,
    MatSidenavModule,
    SidebarComponent,
    MatIconModule,
    MatSelectModule,
    MatStepperModule,
    MatCheckboxModule,
    MatTabsModule,
    MatTableModule,
  ]
})
export class AppModule {
}
