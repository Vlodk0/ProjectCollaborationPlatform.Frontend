import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {BreakpointObserver} from "@angular/cdk/layout";
import {finalize, Subject, takeUntil} from "rxjs";
import {MatDrawerMode} from "@angular/material/sidenav";
import {IconRegistry} from "../../services/general/icon.registry.service";
import {UserService} from "../../services/user.service";
import {Router} from "@angular/router";
import {SocketService} from "../../services/socket.service";
import {SpinnerService} from "../../services/spinner.service";
import {jwtDecode} from "jwt-decode";
import {JwtPayload} from "../../../pages/user-pages/auth-pages/login-page/login-page.component";
import {AdminId, ApplicationRoleEnum} from "../../../core/enums/application-role.enum";

@Component({
  selector: 'collabro-root',
  templateUrl: './root.component.html',
  styleUrl: './root.component.scss'
})
export class RootComponent implements OnInit, OnDestroy {

  constructor(private readonly userService: UserService,
              private readonly matIconRegistry: MatIconRegistry,
              private readonly domSanitizer: DomSanitizer,
              private readonly breakPointObserver: BreakpointObserver,
              private readonly socketService: SocketService,
              private readonly spinnerService: SpinnerService,
              private readonly router: Router) {
  }

  public sidebarExpanded = false;
  private readonly unsubscribe$: Subject<void> = new Subject();
  private isTabletSize: boolean;

  public sidebarMode: MatDrawerMode = 'side';

  public ngOnInit(): void {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      var payload = jwtDecode<JwtPayload>(accessToken);
    }

    accessToken
      ? payload.nameid === AdminId.nameid
        ? this.router.navigateByUrl('dashboard')
        : this.router.navigateByUrl('my-profile')
      : this.router.navigateByUrl('signin');

    this.spinnerService.showSpinner();
    this.userService.getUser()
      .pipe(finalize(() => {
          this.spinnerService.hideSpinner();
        }),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: (user) => {
          this.userService.initUser(user)
          this.socketService.start();
        }
      });

    IconRegistry.register(this.matIconRegistry, this.domSanitizer);
    this.listenToDynamicSidebarModeChange();
    //this.router.navigate(['/signup']);
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.socketService.stop();
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
