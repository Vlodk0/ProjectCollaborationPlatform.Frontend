import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'signin',
    pathMatch: "full"
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import(
        './pages/auth-pages/reset-password-page/reset-password-page-routing.module'
        ).then((r) => r.ResetPasswordPageRoutingModule),
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./pages/auth-pages/login-page/login-page-routing.module').then(
        (r) => r.LoginPageRoutingModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/auth-pages/register-page/register-page-routing.module').then(
        (r) => r.RegisterPageRoutingModule
      ),
  },
  {
    path: 'signup/credentials',
    loadChildren: () =>
      import(
        './pages/auth-pages/after-register-page/after-register-page-routing.module'
        ).then((r) => r.AfterRegisterPageRoutingModule),
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./pages/profile-page/profile-page-routing.module').then(r => r.ProfilePageRoutingModule)
  },
  {
    path: 'all-projects',
    loadChildren: () => import('./pages/all-projects-page/all-projects-page-routing.module').then(r => r.AllProjectsPageRoutingModule)
  },
  {
    path: 'email-failed',
    loadChildren: () => import('./static-pages/email-failed-page/email-failed-page-routing.module').then(r => r.EmailFailedPageRoutingModule)
  },
  {
    path: 'email-success',
    loadChildren: () => import('./static-pages/email-success-page/email-success-page-routing.module').then(r => r.EmailSuccessPageRoutingModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
