import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { RegisterPageRoutingModule } from './register-page-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, RegisterPageRoutingModule],
})
export class RegisterPageModule {}
