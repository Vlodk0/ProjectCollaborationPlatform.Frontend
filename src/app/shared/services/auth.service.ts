import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Login} from "../interfaces/login";
import {Router} from "@angular/router";
import {Register} from "../interfaces/register";
import {catchError, Observable, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = `${environment.securityUrl}/User`;
  result: Subject<boolean> = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  login(loginObj: Login) {
    this.httpClient.post(this.apiUrl + '/SignIn', loginObj)
      .subscribe(
        (res: any) => {
          console.log(res)
          localStorage.setItem('access_token', res.accessToken)
          this.router.navigateByUrl('my-profile')
        }
      )
  }

  register(registerObj: Register) {
    return this.httpClient.post(this.apiUrl + '/SignUp', registerObj)
      .pipe(
        catchError(err => {
          this.result.next(false)
          return of(err)
        })
      )
      .subscribe((res: any) => {
        this.result.next(res.message === "Email has been sent");
      })
  }
}
