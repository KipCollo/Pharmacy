import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationApIsService} from "../services/services/authentication-ap-is.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthenticationApIsService) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    // this.authService.getProfile().subscribe((user) => {
    //   this.profileForm.patchValue(user);
    // });
  }

  updateProfile() {
    // if (this.profileForm.valid) {
    //  // this.authService.updateProfile(this.profileForm.value).subscribe(() => {
    //     alert('Profile updated successfully!');
    //   });
    // }
  }

}
