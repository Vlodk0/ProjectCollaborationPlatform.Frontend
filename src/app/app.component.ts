import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MatDrawerMode} from "@angular/material/sidenav";
import {Subject, takeUntil} from "rxjs";
import {BreakpointObserver} from "@angular/cdk/layout";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {IconRegistry} from "./shared/services/general/icon.registry.service";
import {UserService} from "./shared/services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Collabro';

  constructor(private readonly translate: TranslateService,
              private readonly matIconRegistry: MatIconRegistry,
              private readonly domSanitizer: DomSanitizer,
              private readonly breakPointObserver: BreakpointObserver,
              private readonly userService: UserService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  public sidebarExpanded = false;
  public isAuthenticated: boolean;
  private readonly unsubscribe$: Subject<void> = new Subject();
  private isTabletSize: boolean;

  public sidebarMode: MatDrawerMode = 'side';

  public ngOnInit(): void {
    IconRegistry.register(this.matIconRegistry, this.domSanitizer);
    this.listenToDynamicSidebarModeChange();
  }

  public ngOnDestroy(): void {
  }

  public toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  public listenToDynamicSidebarModeChange(): void {
    this.breakPointObserver.observe('(max-width: 1000px)')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (result) => {
          if (result.matches) {
            this.sidebarMode = 'over';
            this.sidebarExpanded = false;
            this.isTabletSize = true;
          } else {
            this.sidebarMode = 'side';
            this.sidebarExpanded = true;
            this.isTabletSize = false;
          }
        }
      });
  }

  public hideSidebar(): void {
    if (this.isTabletSize) {
      this.sidebarExpanded = false;
    }
  }
}
