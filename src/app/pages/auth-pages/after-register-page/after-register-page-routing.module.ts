import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AfterRegisterPageComponent } from './after-register-page.component';

const routes: Routes = [{ path: '', component: AfterRegisterPageComponent }];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AfterRegisterPageRoutingModule {}
