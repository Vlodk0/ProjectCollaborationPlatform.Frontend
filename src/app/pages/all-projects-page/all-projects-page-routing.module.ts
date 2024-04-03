import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AllProjectsPageComponent} from "./all-projects-page.component";

const routes: Routes = [
  {
    path: '',
    component: AllProjectsPageComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AllProjectsPageRoutingModule { }
