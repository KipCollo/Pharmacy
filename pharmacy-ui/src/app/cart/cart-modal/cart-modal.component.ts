import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore} from './cart.service';
import {LucideAngularModule} from "lucide-angular/src/icons";
import {icons} from "lucide-angular";
import {Router, RouterLink} from "@angular/router";
import {CartRequest} from "../../services/models/cart-request";
import {CartResponse} from "../../services/models/cart-response";
import {CartControllerService} from "../../services/services/cart-controller.service";
import {OrderApIsService} from "../../services/services/order-ap-is.service";
import {TokenService} from "../../services/token/token.service";
import {MedicineApIsService} from "../../services/services/medicine-ap-is.service";

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './cart-modal.component.html',
})
export class CartModalComponent{
  cart = inject(CartStore);

  protected readonly icons = icons;
}
