import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationApIsService} from "../services/services/authentication-ap-is.service";
import {UserRequest} from "../services/models/user-request";
import {CustomersApIsService} from "../services/services/customers-ap-is.service";
import {UserResponse} from "../services/models/user-response";
import {Router} from "@angular/router";
import {TokenService} from "../services/token/token.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  profileForm: FormGroup;
  customerId?: number;
  originalUserData: UserResponse = {}
  customer: UserRequest = {
    customerId: 0,
    dateOfBirth: "",
    email: "",
    firstName: "",
    lastName: "",
    location: "",
    password: "",
    phone: ""
  };
  customerResponse: UserResponse ={}

  constructor(private fb: FormBuilder,
              private customerService: CustomersApIsService,
              private tokenService: TokenService,
              private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      location: [''],
      phone: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.loadUserData()
    this.customerService.getCurrentCustomer().subscribe(
      (user) => {this.customerId = user.customerId}
    )

  }

  loadUserData(){
    this.customerService.getCurrentCustomer().subscribe(
      (data) => {
        this.customerResponse = data
        this.originalUserData = data
        this.profileForm.patchValue(data);
      },
      error => {
        console.log('Error fetching data',error)
      }
    )
  }

  updateCustomer() {
    if (this.profileForm.valid) {
      const updatedUser: UserRequest = {
        ...this.profileForm.value
      };

      this.customerService.updateCustomer({ body: updatedUser }).subscribe({
        next: response => {
          console.log('User updated successfully', response);

        },
        error: err => {
          console.error('Error updating user:', err);
          // Optional: show an error message to the user
        }
      });
    } else {
      console.warn('Profile form is invalid');
    }


}

  deleteAccount(): void {
    if (!this.customerId) return;

    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.customerService.deleteCustomer({customerId: this.customerId}).subscribe({
        next: () => {
          alert('Account deleted successfully.');
          localStorage.removeItem(this.tokenService.token)
          this.router.navigate(['/']); // Redirect to homepage
        },
        error: () => {
          alert('Failed to delete account. Please try again later.');
        }
      });
    }
  }

  cancelEdit() {
    // Example: reset form or reload user data
    this.profileForm.reset(this.originalUserData);
  }
}
