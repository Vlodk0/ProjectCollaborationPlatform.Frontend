import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProfilePageComponent} from "../../../pages/profile-page/profile-page.component";
import {ProfilePageRoutingModule} from "../../../pages/profile-page/profile-page-routing.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfilePageRoutingModule,
  ]
})
export class RootModule { }
