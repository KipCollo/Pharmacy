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
          Authorization: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJmdWxsbmFtZSI6ImNvbGxvIGNvbGxvIiwic3ViIjoiY29sbGluc0BnbWFpbC5jb20iLCJpYXQiOjE3NDA4NjQzNTIsImV4cCI6MTc0MDg2NTIxNiwiYXV0aG9yaXRpZXMiOlsiVVNFUiJdfQ.i-FMIFJvzVWiFKudmpoHQH9kFalXyPY09m7V6FNEWDMvdnZQM5DJNY8XZUnjLnPu1LibTENxltQ2Vej0m5uSAw'
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

