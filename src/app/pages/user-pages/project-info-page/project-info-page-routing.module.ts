import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProjectInfoPageComponent} from "./project-info-page.component";

const routes: Routes = [
  {
    path: '',
    component: ProjectInfoPageComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProjectInfoPageRoutingModule { }
