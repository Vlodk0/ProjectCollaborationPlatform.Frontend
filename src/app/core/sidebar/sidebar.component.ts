import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {Router} from "@angular/router";
import {GetUser} from "../../shared/interfaces/get-user";
import {UserService} from "../../shared/services/user.service";
import {filter, Subject, takeUntil} from "rxjs";
import {MenuConfigInterface} from "../../shared/interfaces/general/menu.interface";
import {ConfigService} from "../../shared/interfaces/general/config.service";
import {ApplicationRoleEnum} from "../enums/application-role.enum";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() public sidebarExpanded = true;

  @Output() public toggleSidebar: EventEmitter<void> = new EventEmitter();
  @Output() public hideSidebar: EventEmitter<void> = new EventEmitter();

  public isLogoutProcessing: boolean = false;
  public menuItems = [];
  public user: GetUser = null;

  private readonly unsubscribe$: Subject<void> = new Subject<void>()

  constructor(private readonly router: Router,
              private readonly configService: ConfigService,
              private readonly userService: UserService,
              private readonly cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.subscribeToCurrentUser();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public subscribeToCurrentUser(): void {
    this.userService.currentUser$
      .pipe(filter(Boolean),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: user => {
          this.user = user;
          this.cdr.detectChanges();

          this.loadMenuItems();
        }
      });
  }

  public doToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  public selectItemMenu(): void {
    this.hideSidebar.emit();
  }

  private loadMenuItems(): void {
    this.configService.getConfigMenu()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (menu) => this.handleMenuItems(menu),
        error: (err) => console.error(`Error fetching menu config:`, err)
      });
  }

  private handleMenuItems(result: MenuConfigInterface): void {
    if (!this.user) return;

    if (this.user.roleName === ApplicationRoleEnum.Dev) {
      this.menuItems = result.developerMenu
    } else if (this.user.roleName === ApplicationRoleEnum.ProjectOwner) {
      this.menuItems = result.projectOwnerMenu
    }

    this.cdr.detectChanges();
  }
}
