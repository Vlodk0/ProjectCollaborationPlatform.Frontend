import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ProjectSummaryComponent} from "./project-summary.component";

const routes: Routes = [
  {
    path: '',
    component: ProjectSummaryComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProjectSummaryRoutingModule { }
