import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AllDevelopersPageComponent} from "./all-developers-page.component";

const routes: Routes = [
  {
    path: '',
    component: AllDevelopersPageComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AllDevelopersPageRoutingModule { }
