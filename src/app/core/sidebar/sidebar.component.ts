import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {GetUser} from "../../shared/interfaces/get-user";
import {UserService} from "../../shared/services/user.service";
import {Subject, takeUntil} from "rxjs";
import {MenuConfigInterface} from "../../shared/interfaces/general/menu.interface";
import {ConfigService} from "../../shared/interfaces/general/config.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() public sidebarExpanded = true;

  @Output() public toggleSidebar: EventEmitter<void> = new EventEmitter();
  @Output() public hideSidebar: EventEmitter<void> = new EventEmitter();

  public isLogoutProcessing: boolean = false;

  public menuItems = [];

  position: string = 'center';

  constructor(private readonly router: Router,
              private readonly configService: ConfigService,
              private readonly userService: UserService) {
  }

  isSubscribe: Subject<void> = new Subject<void>()

  user: GetUser = {
    id: '',
    lastName: '',
    firstName: '',
    email: '',
    roleName: '',
    isDeleted: false
  }

  ngOnInit() {
    localStorage.getItem('access-token')

    this.configService.getConfigMenu().subscribe({
      next: (menu) => this.handleMenuItems(menu),
      error: (err) => console.error('Error fetching menu config:', err)
    });

    this.getUser()
  }

  getUser() {
    this.userService.getUser()
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: value => {
          this.user = value;
        },
        error: err => {
          console.log(err)
        }
      })
  }

  public doToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  public selectItemMenu(): void {
    this.hideSidebar.emit();
  }

  logout(position?: string) {
    this.position = position;

    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to logout?',
    //   header: 'Logout',
    //   icon: 'pi pi-info-circle',
    //   acceptIcon: "none",
    //   rejectIcon: "none",
    //   rejectButtonStyleClass: "p-button-text",
    //   accept: () => {
    //     this.isLogoutProcessing = true;
    //     //this.messageService.add({severity: 'info', summary: 'Confirmed', detail: 'Request submitted'});
    //     localStorage.removeItem('access_token')
    //     localStorage.removeItem('refresh_token')
    //     this.router.navigateByUrl('signin')
    //   },
    //   reject: () => {
    //     //this.messageService.add({severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000});
    //   },
    //   key: 'positionDialog'
    // })
  }

  ngOnDestroy() {
    this.isSubscribe.next();
    this.isSubscribe.complete();
  }

  private handleMenuItems(result: MenuConfigInterface): void {
      this.menuItems = result.userMenu
  }
}
