import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {CarouselComponent} from "../carousel/carousel.component";
import {FeatureComponent} from "../feature/feature.component";
import {FooterComponent} from "../footer/footer.component";
import {GridComponent} from "../grid/grid.component";
import {HeroComponent} from "../hero/hero.component";
import {NavbarComponent} from "../navbar/navbar.component";
import { MedicineListComponent } from "../medicine-list/medicine-list.component";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
    RouterOutlet,
    CarouselComponent,
    FeatureComponent,
    FooterComponent,
    GridComponent,
    HeroComponent,
    NavbarComponent,
    MedicineListComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
