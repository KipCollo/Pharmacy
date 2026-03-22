import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenSubject = new BehaviorSubject<string | null>(this.token);
  token$ = this.tokenSubject.asObservable(); // Observable for real-time updates

  set token(token: string | null) {
    if (!token) {
      localStorage.removeItem('token');
      this.tokenSubject.next(null);
      return;
    }
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  set refreshToken(token: string | null) {
    if (!token) {
      localStorage.removeItem('refreshToken');
      return;
    }
    localStorage.setItem('refreshToken', token);
  }

  get refreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setAuthTokens(token: string | null, refreshToken: string | null) {
    this.token = token;
    this.refreshToken = refreshToken;
  }

  clearAuthTokens() {
    this.token = null;
    this.refreshToken = null;
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
    const token = this.token;
    if (!token) {
      return [];
    }
    const user = this.decodeToken(token);
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
