import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {Login} from "../interfaces/login";
import {Router} from "@angular/router";
import {Register} from "../interfaces/register";
import {BehaviorSubject, catchError, Observable, of, Subject} from 'rxjs';
import {CreateProjectOwner} from "../interfaces/create-project-owner";
import {CreateDeveloper} from "../interfaces/create-developer";
import {TokenResponse} from "../interfaces/token-response";
import {RefreshToken} from "../interfaces/refresh-token";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlSecurity: string = `${environment.securityNgRockUrl}/User`;
  private apiUrl: string = `${environment.apiUrl}/ProjectOwner`;
  private apiUrlDev: string = `${environment.apiUrl}/Developer`;
  private apiUrlUser: string = `${environment.apiUrl}/User`;
  isCreated: Subject<boolean> = new Subject<boolean>();
  private isProjectOwnerSubject = new BehaviorSubject<string>('Default role')
  isProjectOwner$ = this.isProjectOwnerSubject.asObservable();
  constructor(private httpClient: HttpClient, private router: Router) {
  }

  refreshToken(refreshTokenObj: RefreshToken) {
    return this.httpClient.post(this.apiUrlSecurity + '/RefreshToken', refreshTokenObj)
  }

  login(loginObj: Login): Observable<TokenResponse> {
    return this.httpClient.post<TokenResponse>(this.apiUrlSecurity + '/SignIn', loginObj)
  }

  register(registerObj: Register) {
    return this.httpClient.post(this.apiUrlSecurity + '/SignUp', registerObj);
  }

  isUserAdded() {
    return this.httpClient.get(this.apiUrlUser + '/currentUser')
  }

  isDevAdded() {
    return this.httpClient.get(this.apiUrlDev, {})
  }

  createProjectOwner(projectOwner: CreateProjectOwner) {
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
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
