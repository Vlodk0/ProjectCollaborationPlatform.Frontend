import { NgModule } from '@angular/core';
import {DashboardComponent} from "./dashboard.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [{
  path: '',
  component: DashboardComponent
}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
