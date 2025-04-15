import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenSubject = new BehaviorSubject<string | null>(this.token);
  token$ = this.tokenSubject.asObservable(); // Observable for real-time updates

  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token(){
    return localStorage.getItem('token') as string;
  }
}
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import jwtDecode from 'jwt-decode';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private tokenKey = 'authToken';
//
//   constructor(private http: HttpClient, private router: Router) {}
//
//   login(credentials: { email: string; password: string }) {
//     return this.http.post<any>('http://localhost:8080/auth/login', credentials).subscribe(
//       (response) => {
//         localStorage.setItem(this.tokenKey, response.token);
//         const user = this.getUserInfo();
//
//         // Redirect based on role
//         if (user?.role === 'admin') {
//           this.router.navigate(['/admin']);
//         } else {
//           this.router.navigate(['/home']);
//         }
//       },
//       (error) => {
//         console.error('Login failed', error);
//       }
//     );
//   }
//
//   logout() {
//     localStorage.removeItem(this.tokenKey);
//     this.router.navigate(['/home']);
//   }
//
//   getToken(): string | null {
//     return localStorage.getItem(this.tokenKey);
//   }
//
//   getUserInfo(): any {
//     const token = this.getToken();
//     if (token) {
//       return jwtDecode(token); // Decode token to get user info
//     }
//     return null;
//   }
//
//   isLoggedIn(): boolean {
//     return !!this.getToken();
//   }
// }
