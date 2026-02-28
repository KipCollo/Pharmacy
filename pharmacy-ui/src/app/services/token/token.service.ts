import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenSubject = new BehaviorSubject<string | null>(this.token);
  token$ = this.tokenSubject.asObservable(); // Observable for real-time updates

  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token() {
    return localStorage.getItem('token') as string;
  }

  decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getRoles(): string[] | [] {
    const user = this.decodeToken(this.token);
    return user.authorities || [];
  }

  isLoggedIn(): boolean {
    const token = this.token;
    if (!token) return false;

    try {
      const decoded: any = this.decodeToken(token);
      if (!decoded?.exp) return false;

      // check if token is expired
      return Date.now() < decoded.exp * 1000;
    } catch {
      return false;
    }

  }
}
