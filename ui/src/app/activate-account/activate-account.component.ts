import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/services/authentication.service";
import {CodeInputModule} from "angular-code-input";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    CodeInputModule,
    NgIf

  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.css'
})
export class ActivateAccountComponent {

  message ='';
  isOkay = true;
  submitted = false;

  constructor(private router: Router,
              private authService: AuthenticationService) {
  }

  onCodeCompleted(token: string) {
  this.confirmAccount(token);
  }

  redirectToLogin() {

  }

  private confirmAccount(token: string) {
    this.authService.confirm({
      token
    }).subscribe({
      next: () =>{
        this.message = "Your account has been successfully activated.\n Now you can proceed login"
        this.submitted = true;
        this.isOkay =true;
      },
      error: (err) => {
        this.message = "Token has expired. Please try again later";
        this.submitted = true;
        this.isOkay = false;
      }
    })
  }
}
