import {Component, OnInit} from '@angular/core';
import {FormsModule, NgModel} from "@angular/forms";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { AuthenticationApIsService } from '../../services/services/authentication-ap-is.service';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];
  isLoggedIn = false; // Track login state

  constructor(private router: Router,
              private authService: AuthenticationApIsService,
              private tokenService: TokenService
  ) {
  }

  ngOnInit() {
    // Subscribe to token changes to update UI instantly
    this.tokenService.token$.subscribe((token) => {
      this.isLoggedIn = !!token;
    });
  }

  login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        this.tokenService.token = res.token as string;

        const user = this.decodeToken(this.tokenService.token);
        const roles: string[] = user.authorities || []; // Get roles

        if (roles.includes('ADMIN')) {
          this.router.navigate(['/admin']);
        }
        else if (roles.includes('USER')){
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.log(err);
        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.error);
        }
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }

  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
}
