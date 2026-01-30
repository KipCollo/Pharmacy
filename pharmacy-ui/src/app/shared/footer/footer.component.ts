import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {Facebook, LucideAngularModule,Instagram, Twitter, Linkedin} from "lucide-angular/src/icons";


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    LucideAngularModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

  readonly icons = {
   Facebook,
    Instagram,
    Twitter,
    Linkedin
  }

}
