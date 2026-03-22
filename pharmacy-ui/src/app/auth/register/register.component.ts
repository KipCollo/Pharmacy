import { Component, inject, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationApIsService } from "../../services/services/authentication-ap-is.service";
import { RegistrationRequest } from "../../services/models/registration-request";
import { UserRequest } from "../../services/models/user-request";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private router = inject(Router);
  private authService = inject(AuthenticationApIsService);
  hide = signal<boolean>(true);
  confirmPassword = '';
  dateOfBirth: Date | null = null;


  customer: UserRequest = { firstName: '', lastName: '', email: '', password: '' }
  errorMsg: Array<string> = []

  isPersonalStepValid(): boolean {
    const firstName = this.customer.firstName?.trim() ?? '';
    const lastName = this.customer.lastName?.trim() ?? '';
    const email = this.customer.email?.trim() ?? '';
    const phone = this.customer.phone?.trim() ?? '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+]?[-()\s\d]{7,20}$/;

    return firstName.length >= 3
      && lastName.length >= 3
      && emailPattern.test(email)
      && !!this.dateOfBirth
      && (!phone || phonePattern.test(phone));
  }

  isAddressStepValid(): boolean {
    return true;
  }

  isSecurityStepValid(): boolean {
    const password = this.customer.password?.trim() ?? '';
    return password.length >= 6 && this.confirmPassword === this.customer.password;
  }

  isRegisterFormValid(): boolean {
    return this.isPersonalStepValid() && this.isSecurityStepValid();
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  login() {
    this.router.navigate(['login']);
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onRegister() {
    this.errorMsg = []

    if (!this.isRegisterFormValid()) {
      this.errorMsg = ['Please complete all required step fields correctly.'];
      return;
    }

    if (this.dateOfBirth) {
      this.customer.dateOfBirth = this.formatDate(this.dateOfBirth);
    }

    const body: RegistrationRequest = {
      firstName: this.customer.firstName,
      lastName: this.customer.lastName,
      email: this.customer.email,
      password: this.customer.password,
      address: this.customer.location?.trim() ?? '',
      dob: this.customer.dateOfBirth ?? ''
    };

    this.authService.register({
      body
    }).subscribe({
      next: () => {
        //this.onSuccess()
        this.router.navigate(["activate-account"], {
          queryParams: { email: this.customer.email }
        });
      },
      error: (err) => {
        const validationErrors = err?.error?.validationErrors;
        const errorMessage = err?.error?.error;

        if (Array.isArray(validationErrors) && validationErrors.length) {
          this.errorMsg = validationErrors;
        } else if (typeof errorMessage === 'string' && errorMessage.length) {
          this.errorMsg = [errorMessage];
        } else {
          this.errorMsg = ['Registration failed. Please try again.'];
        }
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
