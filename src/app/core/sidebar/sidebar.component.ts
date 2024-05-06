import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetUser } from '../../shared/interfaces/get-user';
import { UserService } from '../../shared/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class SidebarComponent implements OnInit, OnDestroy {
  position: string = 'center';

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserService
  ) {}

  isSubscribe: Subject<void> = new Subject<void>();

  user: GetUser = {
    id: '',
    lastName: '',
    firstName: '',
    email: '',
    roleName: '',
    isDeleted: false,
  };

  ngOnInit() {
    localStorage.getItem('access-token'); //TODO: you do not use what you take from localStorage here

    this.getUser();
  }

  getUser() {
    this.userService
      .getUser()
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: (value) => {
          this.user = value;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  logout(position: string) {
    this.position = position;

    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      header: 'Logout',
      icon: 'pi pi-info-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Request submitted',
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.router.navigateByUrl('signin');
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Process incomplete',
          life: 3000,
        });
      },
      key: 'positionDialog',
    });
  }

  ngOnDestroy() {
    this.isSubscribe.next();
    this.isSubscribe.complete();
  }
}
