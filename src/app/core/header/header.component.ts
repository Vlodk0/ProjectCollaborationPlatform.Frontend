import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit{
  position: string = 'center'

  constructor(private router: Router) {
  }

  ngOnInit() {
    localStorage.getItem('access_token')
  }

  logout(position: string) {
    this.position = position;

    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to logout?',
    //   header: 'Logout',
    //   icon: 'pi pi-info-circle',
    //   acceptIcon:"none",
    //   rejectIcon:"none",
    //   rejectButtonStyleClass: "p-button-text",
    //   accept: () => {
    //     ////this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Request submitted' });
    //     localStorage.removeItem('access_token')
    //     localStorage.removeItem('refresh_token')
    //     this.router.navigateByUrl('signin')
    //   },
    //   reject: () => {
    //     ////this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000});
    //   },
    //   key: 'positionDialog'
    // })
  }
}
