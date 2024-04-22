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
  },
  {
    path: 'my-settings',
    loadChildren: () => import('./pages/settings-page/settings-page-routing.module').then(r => r.SettingsPageRoutingModule)
  },
  {
    path: 'my-project/:id',
    loadChildren: () => import('./pages/project-page/project-page-routing.module').then(r => r.ProjectPageRoutingModule)
  },
  {
    path: 'all-developers',
    loadChildren: () => import('./pages/all-developers-page/all-developers-page-routing.module').then(r => r.AllDevelopersPageRoutingModule)
  },
  {
    path: 'my-projects',
    loadChildren: () => import('./pages/my-projects-page/my-projects-page-routing.module').then(r => r.MyProjectsPageRoutingModule)
  },
  {
    path: 'project-info/:id',
    loadChildren: () => import('./pages/project-info-page/project-info-page-routing.module').then(r => r.ProjectInfoPageRoutingModule)
  },
  {
    path: 'developer/:id',
    loadChildren: () => import('./pages/dev-page/dev-page-routing.module').then(r => r.DevPageRoutingModule)
  },
  {
    path: '404',
    loadChildren: () => import('./static-pages/page-not-found/page-not-found-routing.module').then(r => r.PageNotFoundRoutingModule)
  },
  {
    path: '**',
    redirectTo: '404'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
