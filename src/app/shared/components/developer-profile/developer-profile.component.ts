import {Component, Input} from '@angular/core';
import {DeveloperInterface} from "../../interfaces/developer/developer.interface";
import {Clipboard} from "@angular/cdk/clipboard";
import {SnackBarService} from "../../services/snack-bar.service";

@Component({
  selector: 'collabro-developer-profile',
  templateUrl: './developer-profile.component.html',
  styleUrl: './developer-profile.component.scss'
})
export class DeveloperProfileComponent {
  @Input() developer: DeveloperInterface;
  @Input() developerAvatar?: string | ArrayBuffer

  constructor(private readonly clipboard: Clipboard,
              private readonly notificationService: SnackBarService) {
  }

  public copyEmail(email: string): void {
    this.clipboard.copy(email);
    this.notificationService.showSuccessNotification('Copied to clipboard');
  }
}
