import { Component } from '@angular/core';
import {CustomerRequest} from "../services/models/customer-request";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/services/authentication.service";

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

  customer: CustomerRequest ={firstName: '',lastName: '',email: '',password: ''}
  errorMsg: Array<string> =[]

  constructor(private router: Router,
              private authService: AuthenticationService) {
  }

  register(){
    this.errorMsg = []
    this.authService.register({
      body: this.customer
    }).subscribe({
      next: (res) =>{
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
