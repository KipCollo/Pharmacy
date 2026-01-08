import { NgIf } from '@angular/common';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-navbar-links',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './navbar-links.component.html',
  styleUrl: './navbar-links.component.css'
})
export class NavbarLinksComponent {
  @Input() isLoggedIn: boolean = false;

}
