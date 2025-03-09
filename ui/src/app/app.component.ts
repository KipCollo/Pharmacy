import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {HeroComponent} from "./hero/hero.component";
import {GridComponent} from "./grid/grid.component";
import {FooterComponent} from "./footer/footer.component";
import {FeatureComponent} from "./feature/feature.component";
import {CarouselComponent} from "./carousel/carousel.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, NavbarComponent, HeroComponent, GridComponent, FooterComponent, FeatureComponent, CarouselComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ui';
}
