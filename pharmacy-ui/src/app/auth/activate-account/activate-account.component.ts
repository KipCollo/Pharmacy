import { Component, inject } from '@angular/core';
import {Router} from "@angular/router";
import {CodeInputModule} from "angular-code-input";
import {NgIf} from "@angular/common";
import { AuthenticationApIsService } from '../../services/services/authentication-ap-is.service';

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
  private router = inject(Router);
  private authService = inject(AuthenticationApIsService);


  message ='';
  isOkay = true;
  submitted = false;

  onCodeCompleted(token: string) {
  this.confirmAccount(token);
  }

  redirectToLogin() {
    this.router.navigate(['login'])
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
