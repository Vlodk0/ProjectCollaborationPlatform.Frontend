import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RootComponent} from "./root.component";

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'my-profile',
      },
      {
        path: 'my-profile',
        loadChildren: () =>
          import('../../../pages/profile-page/profile-page-routing.module').then(m => m.ProfilePageRoutingModule)
      },
      {
        path: 'all-projects',
        loadChildren: () => import('../../../pages/all-projects-page/all-projects-page-routing.module').then(r => r.AllProjectsPageRoutingModule)
      },
      {
        path: 'my-projects',
        loadChildren: () => import('../../../pages/my-projects-page/my-projects-page-routing.module').then(r => r.MyProjectsPageRoutingModule)
      },
      {
        path: 'all-developers',
        loadChildren: () => import('../../../pages/all-developers-page/all-developers-page-routing.module').then(r => r.AllDevelopersPageRoutingModule)
      },
      {
        path: 'my-projects/create-project',
        loadChildren: () => import('../../../pages/create-project/create-project.routing.module').then(m => m.CreateProjectRoutingModule)
      },
      {
        path: 'my-project/:id',
        loadChildren: () => import('../../../pages/project-page/project-page-routing.module').then(r => r.ProjectPageRoutingModule)
      },
      {
        path: 'project/:id',
        loadChildren: () => import('../../../pages/project-summary/project-summary.routing.module').then(r => r.ProjectSummaryRoutingModule)
      },
    ],
  },
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RootRoutingModule {
}
