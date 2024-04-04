import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RegisterPageRoutingModule } from './register-page-routing.module';
import {InputSwitchModule} from "primeng/inputswitch";

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, RegisterPageRoutingModule, InputSwitchModule],
})
export class RegisterPageModule {}
