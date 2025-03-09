import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {AuthenticationApIsService} from "../services/services/authentication-ap-is.service";
import {UserRequest} from "../services/models/user-request";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  customer: UserRequest ={firstName: '',lastName: '',email: '',password: ''}
  errorMsg: Array<string> =[]

  constructor(private router: Router,
              private authService: AuthenticationApIsService) {
  }

  register(){
    this.errorMsg = []
    this.authService.register({
      body: this.customer
    }).subscribe({
      next: () =>{
        this.router.navigate(["activate-account"]);
      },
      error: (err) => {
        this.errorMsg = err.error.validationErrors;
      }
    })

  }
  login() {
    this.router.navigate(['login']);
  }
}
