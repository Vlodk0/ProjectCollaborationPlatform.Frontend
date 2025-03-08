import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProjectOwnerDetailsComponent} from "./project-owner-details.component";

const routes: Routes = [
  {
    path: '',
    component: ProjectOwnerDetailsComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProjectOwnerDetailsRoutingModule { }
