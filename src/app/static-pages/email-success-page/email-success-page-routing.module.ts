import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {EmailSuccessPageComponent} from "./email-success-page.component";

const routes: Routes = [
  {
    path: '',
    component: EmailSuccessPageComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class EmailSuccessPageRoutingModule { }
