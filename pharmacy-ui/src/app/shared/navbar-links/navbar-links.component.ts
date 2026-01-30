import { NgIf } from '@angular/common';
import { Component,Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {Heart, LucideAngularModule, MapPin, ShoppingCart} from "lucide-angular/src/icons";
import {FilePlusCorner} from "lucide-angular";

@Component({
  selector: 'app-navbar-links',
  standalone: true,
  imports: [
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './navbar-links.component.html',
  styleUrl: './navbar-links.component.css'
})
export class NavbarLinksComponent {
  @Input() isLoggedIn: boolean = false;

  readonly icons = {
    FilePlusCorner,
    MapPin
  }


}
