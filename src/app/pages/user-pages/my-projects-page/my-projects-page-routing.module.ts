import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {MyProjectsPageComponent} from "./my-projects-page.component";

const routes: Routes = [{
  path: '',
  component: MyProjectsPageComponent
}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MyProjectsPageRoutingModule { }
