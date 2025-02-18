import { NgIf } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import { AuthenticationService } from '../services/services';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  constructor(
   private authService: AuthenticationService
  ){ }
  logout() {
    const linkColor = document.querySelectorAll("nav-link");
    linkColor.forEach(link => {
      if (window.location.href.endsWith(link.getAttribute("href") || '')) {
        link.classList.add('active');
      }
    })
  }

  isAuthenticated(): any{
    //return this.authService.isAuthenticated();
  }

  ngOnInit(): void {
  }
}
