import { NgModule } from '@angular/core';
import {ProjectOwnersComponent} from "./project-owners.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [{
  path: '',
  component: ProjectOwnersComponent,
}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProjectOwnersRoutingModule { }
