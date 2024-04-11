import {
  HTTP_INTERCEPTORS, HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from "rxjs";
import {AuthService} from "../../shared/services/auth.service";
import {TokenResponse} from "../../shared/interfaces/token-response";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  private isRefreshed = false;
  private tokenRefresh: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');

    let authRequest = req;

    if (token != null) {
      authRequest = this.addTokenHeader(authRequest, token);
    }

    return next.handle(authRequest).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return this.error401Handle(authRequest, next);
      }

      return throwError(error);
    }));
  }

  private error401Handle(request: HttpRequest<any>, next: HttpHandler) {
    this.isRefreshed = true;
    this.tokenRefresh.next(null);

    const token = localStorage.getItem('access_token');

    if (token) {
      let tokens: TokenResponse = {
        accessToken: localStorage.getItem('access_token'),
        refreshToken: localStorage.getItem('refresh_token'),
      }
      return this.authService.refreshToken(tokens).pipe(
        switchMap((token: any) => {
          this.isRefreshed = false;

          localStorage.setItem('access_token', token.accessToken);
          this.tokenRefresh.next(token.accessToken);

          return next.handle(this.addTokenHeader(request, token));
        }),
        catchError((err) => {
          this.isRefreshed = false;

          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          return throwError(err);
        })
      );
    }
    return this.tokenRefresh.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: any, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export const httpInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true},
];
