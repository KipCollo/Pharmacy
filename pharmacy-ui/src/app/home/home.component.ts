import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { CarouselComponent } from "../carousel/carousel.component";
import { HeroComponent } from "./hero/hero.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { MedicineListComponent } from "../medicine-list/medicine-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CarouselComponent,
    HeroComponent,
    MedicineListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
