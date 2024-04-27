import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AfterRegisterPageRoutingModule } from './after-register-page-routing.module';
import { FormsModule } from '@angular/forms';
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, FormsModule, AfterRegisterPageRoutingModule],
})
export class AfterRegisterPageModule {}
