import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {TokenService} from "../token/token.service";
import { Injectable, inject } from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  private tokenService = inject(TokenService);


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.token;

    if (token){
      const authRequest = req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      })
      console.log('Token found');
      return next.handle(authRequest)
    } else {
      console.log('No token found');
      return next.handle(req);
    }


  }
}




