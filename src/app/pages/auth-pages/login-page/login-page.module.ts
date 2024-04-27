import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageRoutingModule } from './login-page-routing.module';
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, LoginPageRoutingModule],
})
export class LoginPageModule {}
