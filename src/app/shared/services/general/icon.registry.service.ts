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
  }
}
