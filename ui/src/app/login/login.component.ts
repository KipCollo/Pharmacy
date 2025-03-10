import { Component } from '@angular/core';
import {AuthenticationRequest} from "../services/models/authentication-request";
import {FormsModule, NgModel} from "@angular/forms";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {TokenService} from "../services/token/token.service";
import {AuthenticationApIsService} from "../services/services/authentication-ap-is.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgOptimizedImage,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  authRequest: AuthenticationRequest = {email: '', password:''};
  errorMsg:Array<string> =[];

  // Client-side validation
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(private router: Router,
              private authService: AuthenticationApIsService,
              private tokenService: TokenService
              )
              {
  }

  login() {
    this.errorMsg =[];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) =>{
        this.tokenService.token = res.token as string;
        this.router.navigate(['medicine-list']);
      },
      error: (err) => {
        console.log(err);
        if(err.error.validationErrors){
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
}
