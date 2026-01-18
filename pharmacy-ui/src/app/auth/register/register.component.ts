import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {AuthenticationApIsService} from "../../services/services/authentication-ap-is.service";
import {UserRequest} from "../../services/models/user-request";


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
  
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  customer: UserRequest ={firstName: '',lastName: '',email: '',password: ''}
  errorMsg: Array<string> =[]

  constructor(private router: Router,
              private authService: AuthenticationApIsService,
             // private snackBar: MatSnackBar
            ) {
  }

  login() {
    this.router.navigate(['login']);
  }

  onRegister() {
    this.errorMsg = []

    if (!this.customer.firstName || !this.customer.lastName || !this.customer.email || !this.customer.password) {
      this.errorMsg = ['Please fill in all required fields.'];
      return;
    }

    this.authService.register({
      body: this.customer
    }).subscribe({
      next: () =>{
        //this.onSuccess()
        this.router.navigate(["activate-account"]);
      },
      error: (err) => {
        this.errorMsg = err.error.validationErrors;
      }
    })
  }

  // onSuccess(){
  //   this.snackBar.open(
  //     'Registration successful! Please activate Account',
  //     'Close',
  //   {
  //     duration: 3000,
  //     horizontalPosition: 'center',
  //     verticalPosition: 'top',
  //     panelClass: ['success-snackbar']
  //   })
  // }

}
