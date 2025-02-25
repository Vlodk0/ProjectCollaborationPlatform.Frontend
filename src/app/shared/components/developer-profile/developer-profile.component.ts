import {Component, Input} from '@angular/core';
import {DeveloperInterface} from "../../interfaces/developer/developer.interface";
import {Clipboard} from "@angular/cdk/clipboard";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'collabro-developer-profile',
  templateUrl: './developer-profile.component.html',
  styleUrl: './developer-profile.component.scss'
})
export class DeveloperProfileComponent {
  @Input() developer: DeveloperInterface;

  constructor(private readonly clipboard: Clipboard,
              private readonly notificationService: NotificationService) {
  }

  public copyEmail(email: string): void {
    this.clipboard.copy(email);
    this.notificationService.showSuccessNotification('Copied to clipboard');
  }
}
