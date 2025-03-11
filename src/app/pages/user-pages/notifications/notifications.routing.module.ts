import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {NotificationsComponent} from "./notifications.component";
import { NotificationListItemComponent } from './notification-list-item/notification-list-item.component';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {NgForOf} from "@angular/common";

const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent
  }
]

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(routes),
    MatIcon,
    MatIconButton,
    NgForOf
  ],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
