import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {BreakpointObserver} from "@angular/cdk/layout";
import {Subject, takeUntil} from "rxjs";
import {MatDrawerMode} from "@angular/material/sidenav";
import {IconRegistry} from "../../services/general/icon.registry.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'collabro-root',
  templateUrl: './root.component.html',
  styleUrl: './root.component.scss'
})
export class RootComponent implements OnInit, OnDestroy {

  constructor(private readonly userService: UserService,
              private readonly matIconRegistry: MatIconRegistry,
              private readonly domSanitizer: DomSanitizer,
              private readonly breakPointObserver: BreakpointObserver) {
  }

  public sidebarExpanded = false;
  public isAuthenticated: boolean;
  private readonly unsubscribe$: Subject<void> = new Subject();
  private isTabletSize: boolean;

  public sidebarMode: MatDrawerMode = 'side';

  public ngOnInit(): void {
    IconRegistry.register(this.matIconRegistry, this.domSanitizer);
    this.listenToDynamicSidebarModeChange();
    this.userService.initUser();
    //this.router.navigate(['/signin']);
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
