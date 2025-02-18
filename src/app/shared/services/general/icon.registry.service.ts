import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

export class IconRegistry {
  public static register(
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer): void {
    matIconRegistry.addSvgIcon(
      'my-profile-icon',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/my-profile-icon.svg'));
    matIconRegistry.addSvgIcon(
      'developers-icon',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/developers-icon.svg'));
    matIconRegistry.addSvgIcon(
      'my-projects-icon',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/my-projects-icon.svg'));
    matIconRegistry.addSvgIcon(
      'all-projects-icon',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/all-projects-icon.svg'));
    matIconRegistry.addSvgIcon(
      'menu',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/menu-icon.svg'));
    matIconRegistry.addSvgIcon(
      'log-out',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/log-out.svg'));
    matIconRegistry.addSvgIcon(
      'avatar-placeholder-icon',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/avatar-placeholder-icon.svg'));
    matIconRegistry.addSvgIcon(
      'edit',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/edit.svg'));
    matIconRegistry.addSvgIcon(
      'project-duration-icon',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/project-duration-icon.svg'));
    matIconRegistry.addSvgIcon(
      'close',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/close-icon.svg'));
    matIconRegistry.addSvgIcon(
      'check',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/check-icon.svg'));
    matIconRegistry.addSvgIcon(
      'arrow-left',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow-left-icon.svg'));
    matIconRegistry.addSvgIcon(
      'arrow-right',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/arrow-right-icon.svg'));
    matIconRegistry.addSvgIcon(
      'location',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/location-icon.svg'));
    matIconRegistry.addSvgIcon(
      'plus',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/plus-icon.svg'));
    matIconRegistry.addSvgIcon(
      'calendar',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/calendar-icon.svg'));
    matIconRegistry.addSvgIcon(
      'copy',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/copy-icon.svg'));
    matIconRegistry.addSvgIcon(
      'accept',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/accept-icon.svg'));
    matIconRegistry.addSvgIcon(
      'reject',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/reject-icon.svg'));
    matIconRegistry.addSvgIcon(
      'delete',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/delete-icon.svg'));
    matIconRegistry.addSvgIcon(
      'profile',
      domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/profile-icon.svg'));
  }
}
