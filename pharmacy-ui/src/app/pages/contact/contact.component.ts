import { Component } from '@angular/core';
import {MapComponent} from "../../map/map.component";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    MapComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

}
