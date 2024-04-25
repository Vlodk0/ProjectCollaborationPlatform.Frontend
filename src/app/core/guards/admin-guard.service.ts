import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../../shared/services/user.service";
import { GetUser } from "../../shared/interfaces/get-user";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate() {
    return this.userService.getUser().pipe(
      map((user: GetUser) => {
        if (user && user.roleName === 'Admin') {
          return true;
        } else {
          this.router.navigateByUrl('/404');
          return false;
        }
      })
    );
  }
}
