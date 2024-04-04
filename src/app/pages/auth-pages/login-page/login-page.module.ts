import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page.component';
import { SharedModule } from '../../shared/shared.module';
import { LoginPageRoutingModule } from './login-page-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, LoginPageRoutingModule],
})
export class LoginPageModule {}
