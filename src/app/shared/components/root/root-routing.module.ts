import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RootComponent} from "./root.component";

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [

      //INFO: User pages
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'my-profile',
      },
      {
        path: 'my-profile',
        loadChildren: () =>
          import('../../../pages/user-pages/profile-page/profile-page-routing.module').then(m => m.ProfilePageRoutingModule)
      },
      {
        path: 'all-projects',
        loadChildren: () => import('../../../pages/user-pages/all-projects-page/all-projects-page-routing.module').then(r => r.AllProjectsPageRoutingModule)
      },
      {
        path: 'my-projects',
        loadChildren: () => import('../../../pages/user-pages/my-projects-page/my-projects-page-routing.module').then(r => r.MyProjectsPageRoutingModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('../../../pages/user-pages/notifications/notifications.routing.module').then(r => r.NotificationsRoutingModule)
      },
      {
        path: 'all-developers',
        loadChildren: () => import('../../../pages/user-pages/all-developers-page/all-developers-page-routing.module').then(r => r.AllDevelopersPageRoutingModule)
      },
      {
        path: 'my-projects/create-project',
        loadChildren: () => import('../../../pages/user-pages/create-project/create-project.routing.module').then(m => m.CreateProjectRoutingModule)
      },
      {
        path: 'my-project/:id',
        loadChildren: () => import('../../../pages/user-pages/project-page/project-page-routing.module').then(r => r.ProjectPageRoutingModule)
      },
      {
        path: 'project/:id',
        loadChildren: () => import('../../../pages/user-pages/project-summary/project-summary.routing.module').then(r => r.ProjectSummaryRoutingModule)
      },

      //INFO: Admin pages
      {
        path: 'dashboard',
        loadChildren: () => import('../../../pages/admin-pages/dashboard/dashboard.routing.module').then(r => r.DashboardRoutingModule)
      },
      {
        path: 'projects',
        loadChildren: () => import('../../../pages/admin-pages/projects/projects.routing.module').then(r => r.ProjectsRoutingModule)
      },
      {
        path: 'developers',
        loadChildren: () => import('../../../pages/admin-pages/developers/developers.routing.module').then(r => r.DevelopersRoutingModule)
      },
      {
        path: 'project-owners',
        loadChildren: () => import('../../../pages/admin-pages/project-owners/project-owners.routing.module').then(r => r.ProjectOwnersRoutingModule)
      },      {
        path: 'project-owners/:id',
        loadChildren: () => import('../../../pages/admin-pages/project-owner-details/project-owner-details.routing.module').then(r => r.ProjectOwnerDetailsRoutingModule)
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
