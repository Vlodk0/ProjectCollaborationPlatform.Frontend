import {Component, Input} from '@angular/core';
import { technologiesListConstant } from '../../../core/constants/technology-list.constant';
import { frameworkListConstant } from '../../../core/constants/framework-list.constant';
import {DeveloperInterface} from "../../interfaces/developer/developer.interface";
import {Clipboard} from "@angular/cdk/clipboard";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'collabro-developer-profile',
  templateUrl: './developer-profile.component.html',
  styleUrl: './developer-profile.component.scss'
})
export class DeveloperProfileComponent {
  @Input() developer: DeveloperInterface;

  public technologiesListConstant = technologiesListConstant;
  public frameworkListConstant = frameworkListConstant;


  constructor(private readonly clipboard: Clipboard,
              private readonly notificationService: NotificationService) {
  }

  public copyEmail(email: string): void {
    this.clipboard.copy(email);
    this.notificationService.showSuccessNotification('Copied to clipboard');
  }
}
