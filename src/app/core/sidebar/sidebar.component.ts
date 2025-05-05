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
import {GetUser} from "../../shared/interfaces/get-user";
import {UserService} from "../../shared/services/user.service";
import {filter, Subject, takeUntil} from "rxjs";
import {MenuConfigInterface} from "../../shared/interfaces/general/menu.interface";
import {ConfigService} from "../../shared/interfaces/general/config.service";
import {ApplicationRoleEnum} from "../enums/application-role.enum";
import {BadgesService} from "../../shared/services/badges.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BadgesFormGroup} from "../types/form-groups/badges-form-group";
import {AlertsService} from "../../shared/services/alerts.service";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmDialogService} from "../../shared/services/confirm-dialog.service";
import {Router} from "@angular/router";

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
  public badgesFormGroup: FormGroup<BadgesFormGroup>;

  private readonly unsubscribe$: Subject<void> = new Subject<void>()

  constructor(private readonly alertService: AlertsService,
              private readonly configService: ConfigService,
              private readonly fb: FormBuilder,
              private readonly translateService: TranslateService,
              private readonly confirmDialogService: ConfirmDialogService,
              private readonly userService: UserService,
              private readonly badgesService: BadgesService,
              private readonly router: Router,
              private readonly cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.subscribeToCurrentUser();
    this.setForm();
    this.updateBadge();
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


          this.user?.roleName === ApplicationRoleEnum.Dev
            ? this.getDeveloperBadges()
            : this.getProjectOwnerBadges();
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
      this.menuItems = result.developerMenu;
    } else if (this.user.roleName === ApplicationRoleEnum.ProjectOwner) {
      this.menuItems = result.projectOwnerMenu;
    } else if (this.user.roleName === ApplicationRoleEnum.Admin) {
      this.menuItems = result.adminMenu;
    }

    this.cdr.detectChanges();
  }

  public updateBadge(): void {
    this.alertService.getNewAlert()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => this.user?.roleName === ApplicationRoleEnum.Dev
          ? this.getDeveloperBadges()
          : this.getProjectOwnerBadges()
      });
  }

  private getDeveloperBadges(): void {
    this.badgesService.getDeveloperBadges(this.user.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (badges) => {
          this.badgesFormGroup.patchValue(badges);
          this.cdr.detectChanges();
        }
      })
  }

  private getProjectOwnerBadges(): void {
    this.badgesService.getProjectOwnerBadges(this.user.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (badges) => {
          this.badgesFormGroup.patchValue(badges);
          this.cdr.detectChanges();
        }
      })
  }

  private setForm(): void {
    this.badgesFormGroup = this.fb.group<BadgesFormGroup>({
      totalNotifications: this.fb.control(null),
      totalProjectRequests: this.fb.control(null)
    });
  }

  public logout(): void {
    const title = this.translateService.instant('general.areYouSureYouWantLogOutLabel');

    this.confirmDialogService.openConfirmDialog(title)
      .pipe(
        filter((result) => !!result),
        takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.isLogoutProcessing = true;
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.router.navigateByUrl('signin');
        }
      })
  }
}
