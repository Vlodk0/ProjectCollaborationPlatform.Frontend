import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterPageRoutingModule } from './register-page-routing.module';
import {InputSwitchModule} from "primeng/inputswitch";
import {SharedModule} from "../../../shared/shared.module";
import {MessagesModule} from "primeng/messages";

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, RegisterPageRoutingModule, InputSwitchModule],
})
export class RegisterPageModule {}
