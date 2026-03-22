import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpBackend,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {TokenService} from "../token/token.service";
import { Injectable, inject } from "@angular/core";
import {Observable, BehaviorSubject, throwError} from "rxjs";
import { catchError, filter, finalize, switchMap, take } from "rxjs/operators";
import { ApiConfiguration } from '../api-configuration';
import { AuthenticationResponse } from '../models/authentication-response';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  private tokenService = inject(TokenService);
  private apiConfiguration = inject(ApiConfiguration);
  private http: HttpClient;

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private httpBackend: HttpBackend) {
    // Bypass interceptor chain for refresh-token call to avoid recursion.
    this.http = new HttpClient(httpBackend);
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/auth/refresh-token')) {
      return next.handle(req);
    }

    const token = this.tokenService.token;
    const authRequest = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      : req;

    return next.handle(authRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          return throwError(() => error);
        }

        return this.handle401Error(authRequest, next);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token): token is string => token !== null),
        take(1),
        switchMap((token) => {
          const retryRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(retryRequest);
        })
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.refreshAccessToken().pipe(
      switchMap((response: AuthenticationResponse) => {
        const newAccessToken = response.token ?? null;
        const newRefreshToken = response.refreshToken ?? this.tokenService.refreshToken;

        if (!newAccessToken) {
          this.tokenService.clearAuthTokens();
          return throwError(() => new Error('Refresh did not return an access token'));
        }

        this.tokenService.setAuthTokens(newAccessToken, newRefreshToken ?? null);
        this.refreshTokenSubject.next(newAccessToken);

        const retryRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newAccessToken}`
          }
        });

        return next.handle(retryRequest);
      }),
      catchError((refreshError) => {
        this.tokenService.clearAuthTokens();
        return throwError(() => refreshError);
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  private refreshAccessToken(): Observable<AuthenticationResponse> {
    const refreshToken = this.tokenService.refreshToken;

    if (!refreshToken) {
      return throwError(() => new Error('Missing refresh token'));
    }

    return this.http.post<AuthenticationResponse>(
      `${this.apiConfiguration.rootUrl}/auth/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      }
    );
  }
}




