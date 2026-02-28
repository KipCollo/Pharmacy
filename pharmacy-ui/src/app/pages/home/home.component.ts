import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeroComponent } from "./hero/hero.component";
import { ProductListComponent } from '../../products/product-list/product-list.component';
import { CarouselComponent } from "./carousel/carousel.component";
import {TrendingComponent} from "./trending/trending.component";
import {SpecialOffersComponent} from "./special-offers/special-offers.component";
import {FeatureComponent} from "./feature/feature.component";
import {NewArrivalComponent} from "./new-arrival/new-arrival.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    CarouselComponent,
    TrendingComponent,
    SpecialOffersComponent,
    FeatureComponent,
    NewArrivalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
