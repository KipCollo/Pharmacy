import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {TokenService} from "../token/token.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService:TokenService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.token;

    if (token){
      const authRequest = req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer `  + token})
      })
      return next.handle(authRequest)
    }
    return next.handle(req);
  }
}

