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
        './auth-page/reset-password-page/reset-password-page-routing.module'
        ).then((r) => r.ResetPasswordPageRoutingModule),
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./auth-page/login-page/login-page-routing.module').then(
        (r) => r.LoginPageRoutingModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./auth-page/register-page/register-page-routing.module').then(
        (r) => r.RegisterPageRoutingModule
      ),
  },
  {
    path: 'signup/credentials',
    loadChildren: () =>
      import(
        './auth-page/after-register-page/after-register-page-routing.module'
        ).then((r) => r.AfterRegisterPageRoutingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
