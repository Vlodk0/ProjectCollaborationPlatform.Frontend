import {
  HTTP_INTERCEPTORS, HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor, HttpInterceptorFn,
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

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = localStorage.getItem('access_token');

    if (token) {
      req = this.addTokenHeader(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.error401Handle(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private error401Handle(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.isRefreshed) {
      this.isRefreshed = true;
      this.tokenRefresh.next(null);

      let tokens: TokenResponse = {
        accessToken: localStorage.getItem('access_token')!,
        refreshToken: localStorage.getItem('refresh_token')!,
      }
      return this.authService.refreshToken(tokens).pipe(
        switchMap((tokens: TokenResponse) => {
          this.isRefreshed = false;
          this.tokenRefresh.next(tokens.accessToken);
          localStorage.setItem('access_token', tokens.accessToken);
          localStorage.setItem('refresh_token', tokens.refreshToken);
          return next.handle(this.addTokenHeader(request, tokens.accessToken));
        }),
        catchError((error) => {
          this.isRefreshed = false;
          return throwError(error);
        })
      );
    } else {
      return this.tokenRefresh.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addTokenHeader(request, token));
        })
      );
    }
  }

  private addTokenHeader(request: any, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }
}

export const httpInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request)
}

