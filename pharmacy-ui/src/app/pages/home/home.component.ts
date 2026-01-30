import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeroComponent } from "./hero/hero.component";
import { ProductListComponent } from '../../products/product-list/product-list.component';
import { CarouselComponent } from "./carousel/carousel.component";
import {GridComponent} from "./grid/grid.component";



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ProductListComponent,
    CarouselComponent,
    GridComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
