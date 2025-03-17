import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {InvitationsComponent} from "./invitations.component";

const routes: Routes = [{
  path: '',
  component: InvitationsComponent
}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class InvitationsRoutingModule { }
