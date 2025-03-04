import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DevelopersComponent} from "./developers.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [{
  path: '',
  component: DevelopersComponent
}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DevelopersRoutingModule { }
