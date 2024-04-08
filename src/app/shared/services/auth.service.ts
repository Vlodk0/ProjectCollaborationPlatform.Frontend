import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Login} from "../interfaces/login";
import {Router} from "@angular/router";
import {Register} from "../interfaces/register";
import {catchError, Observable, of, Subject} from 'rxjs';
import {CreateProjectOwner} from "../interfaces/create-project-owner";
import {CreateDeveloper} from "../interfaces/create-developer";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlSecurity: string = `${environment.securityNgRockUrl}/User`;
  private apiUrl: string = `${environment.apiUrl}/ProjectOwner`;
  private apiUrlDev: string = `${environment.apiUrl}/Developer`;
  result: Subject<boolean> = new Subject<boolean>();
  isCreated: Subject<boolean> = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  login(loginObj: Login) {
    this.httpClient.post(this.apiUrlSecurity + '/SignIn', loginObj)
      .subscribe(
        (res: any) => {
          console.log(res)
          localStorage.setItem('access_token', res.accessToken)
          this.router.navigateByUrl('my-profile')
        }
      )
  }

  register(registerObj: Register) {
    return this.httpClient.post(this.apiUrlSecurity + '/SignUp', registerObj)
      .pipe(
        catchError(err => {
          this.result.next(false)
          return of(err)
        })
      )
      .subscribe((res: any) => {
        this.result.next(res.message === "Email has been sent");
        localStorage.setItem('email', registerObj.email)
      })
  }

  isProjectOwnerAdded() {
    this.httpClient.get(this.apiUrl, {})
      .pipe(
        catchError(err => {
          this.isCreated.next(true)
          return of(err);
        })
      )
      .subscribe((res: any) => {
        this.isCreated.next(res.message === "User exists");
      })
  }

  isDevAdded() {
    this.httpClient.get(this.apiUrlDev, {})
      .pipe(
        catchError(err => {
          this.isCreated.next(true)
          return of(err);
        })
      )
      .subscribe((res: any) => {
        this.isCreated.next(res.message === "User exists");
      })
  }

  createProjectOwner(projectOwner: CreateProjectOwner) {
    return this.httpClient.post(this.apiUrl, projectOwner)
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.router.navigateByUrl('/signin')
          }
        }
      )
  }

  createDev(dev: CreateDeveloper) {
    return this.httpClient.post(this.apiUrlDev, dev)
      .subscribe(
        (res: any) => {
          if (res.success) {
            this.router.navigateByUrl('/signin')
          }
        }
      )
  }
}
