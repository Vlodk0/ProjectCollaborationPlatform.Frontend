import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {EmailFailedPageComponent} from "./email-failed-page.component";

const routes: Routes = [
  {
    path: '',
    component: EmailFailedPageComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EmailFailedPageRoutingModule { }
