import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  //isLoggedIn = !!localStorage.getItem('userToken'); // Check login status
    isLoggedIn = true;

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('userToken'); // Clear the session
    this.isLoggedIn = false; // Update UI
    this.router.navigate(['/login']); // Redirect to login page
  }
}
