import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AdminPanelComponent} from "./admin-panel.component";

const routes: Routes = [{
  path: '',
  component: AdminPanelComponent
}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
