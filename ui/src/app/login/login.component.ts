import { Component } from '@angular/core';
import {AuthenticationRequest} from "../services/models/authentication-request";
import {FormsModule, NgModel} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/services/authentication.service";
import {TokenService} from "../services/token/token.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  image = "../public/login.jpg";
  authRequest: AuthenticationRequest = {email: '', password:''};
  errorMsg:Array<string> =[];

  // Client-side validation
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(private router: Router,
              private authService: AuthenticationService,
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
        this.router.navigate(['home']);
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
