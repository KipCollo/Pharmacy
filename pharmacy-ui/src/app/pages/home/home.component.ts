import { Component } from '@angular/core';
import { HeroComponent } from './hero/hero.component';
import { CarouselComponent } from './carousel/carousel.component';
import { SpecialOffersComponent } from './special-offers/special-offers.component';
import { FeatureComponent } from './feature/feature.component';
import { NewArrivalComponent } from './new-arrival/new-arrival.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    SpecialOffersComponent,
    FeatureComponent,
    NewArrivalComponent,
    CarouselComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
